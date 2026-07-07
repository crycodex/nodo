import { useCallback, useEffect, useRef, useState } from 'react'

const SpeechRecognitionAPI =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : undefined

export function useSpeechRecognition({ lang = 'es-ES' } = {}) {
  const isSupported = Boolean(SpeechRecognitionAPI)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef(null)

  useEffect(() => {
    if (!isSupported) return

    const recognition = new SpeechRecognitionAPI()
    recognition.lang = lang
    recognition.interimResults = true
    recognition.continuous = false

    recognition.onresult = (event) => {
      const text = Array.from(event.results)
        .map((result) => result[0].transcript)
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
