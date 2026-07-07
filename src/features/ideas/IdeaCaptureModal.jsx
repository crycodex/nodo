import { useState } from 'react'
import Modal from '../../components/ui/Modal'
import IdeaCaptureForm from './IdeaCaptureForm'

export default function IdeaCaptureModal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Capturar nueva idea"
        title="Capturar nueva idea"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-text text-2xl text-bg shadow-lg transition-transform hover:scale-105"
      >
        +
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Nueva idea">
        <IdeaCaptureForm onSaved={() => setOpen(false)} />
      </Modal>
    </>
  )
}
