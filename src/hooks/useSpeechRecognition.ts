import { useCallback, useEffect, useRef, useState } from 'react'

const SpeechRecognitionAPI: typeof SpeechRecognition | undefined =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : undefined

interface UseSpeechRecognitionOptions {
  lang?: string
}

export function useSpeechRecognition({ lang = 'es-ES' }: UseSpeechRecognitionOptions = {}) {
  const isSupported = Boolean(SpeechRecognitionAPI)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    if (!isSupported || !SpeechRecognitionAPI) return

    const recognition = new SpeechRecognitionAPI()
    recognition.lang = lang
    recognition.interimResults = true
    recognition.continuous = false

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const text = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? '')
        .join(' ')
      setTranscript(text)
    }

    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)

    recognitionRef.current = recognition

    return () => {
      recognition.stop()
      recognitionRef.current = null
    }
  }, [isSupported, lang])

  const start = useCallback(() => {
    if (!recognitionRef.current) return
    setTranscript('')
    setIsListening(true)
    recognitionRef.current.start()
  }, [])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  const reset = useCallback(() => setTranscript(''), [])

  return { isSupported, isListening, transcript, start, stop, reset }
}
