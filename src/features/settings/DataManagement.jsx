import { useRef, useState } from 'react'
import Button from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { exportToJson, importFromFile, resetAll } from '../../services/storageService'

export default function DataManagement() {
  const fileInputRef = useRef(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [importError, setImportError] = useState('')

  async function handleImportChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const result = await importFromFile(file, 'replace')
    setImportError(result.success ? '' : result.reason)
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium text-text">Datos</p>
        <p className="text-xs text-text-muted">
          Todo se guarda solo en este navegador. Exporta un respaldo periódicamente.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" onClick={exportToJson}>
          Exportar JSON
        </Button>
        <Button variant="ghost" onClick={() => fileInputRef.current?.click()}>
          Importar JSON
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleImportChange}
        />
        <Button variant="danger" onClick={() => setConfirmReset(true)}>
          Borrar todos los datos
        </Button>
      </div>

      {importError ? <p className="text-xs text-state-descartada">{importError}</p> : null}

      <ConfirmDialog
        open={confirmReset}
        title="Borrar todos los datos"
        description="Esta acción elimina todas las ideas guardadas de forma permanente. No se puede deshacer."
        confirmLabel="Borrar todo"
        danger
        onConfirm={() => {
          resetAll()
          setConfirmReset(false)
        }}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  )
}
