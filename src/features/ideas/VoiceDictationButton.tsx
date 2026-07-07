import { useEffect } from 'react'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'

interface VoiceDictationButtonProps {
  lang: string
  onTranscript: (text: string) => void
}

export default function VoiceDictationButton({ lang, onTranscript }: VoiceDictationButtonProps) {
  const { isSupported, isListening, transcript, start, stop } = useSpeechRecognition({ lang })

  useEffect(() => {
    if (transcript) onTranscript(transcript)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript])

  if (!isSupported) {
    return (
      <span
        className="text-xs text-text-muted"
        title="El dictado por voz no está disponible en este navegador."
      >
        🎙️ no disponible
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={isListening ? stop : start}
      aria-pressed={isListening}
      aria-label={isListening ? 'Detener dictado' : 'Iniciar dictado por voz'}
      title={isListening ? 'Detener dictado' : 'Dictar por voz'}
      className={`flex h-7 w-7 items-center justify-center rounded-full text-sm transition-colors ${
        isListening ? 'animate-pulse bg-state-descartada text-white' : 'bg-border/60 text-text hover:bg-border'
      }`}
    >
      🎙️
    </button>
  )
}
