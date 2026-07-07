import { useState } from 'react'
import type { FormEvent } from 'react'
import TextField from '../../components/ui/TextField'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import VoiceDictationButton from './VoiceDictationButton'
import { useIdeasStore } from '../../store/ideasStore'
import { useSettingsStore } from '../../store/settingsStore'

interface IdeaCaptureFormProps {
  onSaved?: () => void
}

export default function IdeaCaptureForm({ onSaved }: IdeaCaptureFormProps) {
  const addIdea = useIdeasStore((state) => state.addIdea)
  const voiceLang = useSettingsStore((state) => state.voiceLang)

  const [titulo, setTitulo] = useState('')
  const [idea, setIdea] = useState('')
  const [problema, setProblema] = useState('')
  const [lugar, setLugar] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    addIdea({ titulo, idea, problema, lugar })
    setTitulo('')
    setIdea('')
    setProblema('')
    setLugar('')
    onSaved?.()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField
        id="idea-titulo"
        label="Título (opcional)"
        value={titulo}
        onChange={(event) => setTitulo(event.target.value)}
        placeholder="Un nombre corto para la idea"
      />

      <TextArea
        id="idea-texto"
        label="Idea"
        value={idea}
        onChange={(event) => setIdea(event.target.value)}
        placeholder="¿Cuál es la idea?"
        rightSlot={
          <VoiceDictationButton lang={voiceLang} onTranscript={(text) => setIdea(text)} />
        }
      />

      <TextArea
        id="idea-problema"
        label="Problema que resuelve (opcional)"
        value={problema}
        onChange={(event) => setProblema(event.target.value)}
        placeholder="¿Qué problema resuelve?"
        rightSlot={
          <VoiceDictationButton lang={voiceLang} onTranscript={(text) => setProblema(text)} />
        }
      />

      <TextField
        id="idea-lugar"
        label="Lugar (opcional)"
        value={lugar}
        onChange={(event) => setLugar(event.target.value)}
        placeholder="Contexto o lugar de referencia"
      />

      <Button type="submit" className="self-end">
        Guardar idea
      </Button>
    </form>
  )
}
