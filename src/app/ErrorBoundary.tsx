import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import Button from '../components/ui/Button'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Nodo crashed:', error, errorInfo.componentStack)
  }

  handleReload = () => {
    this.setState({ error: null })
    window.location.reload()
  }

  handleResetData = () => {
    window.localStorage.removeItem('nodo-ideas')
    window.location.reload()
  }

  override render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-bg px-4 text-center text-text">
        <h1 className="text-lg font-semibold">Algo salió mal</h1>
        <p className="max-w-sm text-sm text-text-muted">
          Nodo encontró un error inesperado. Puedes intentar recargar, o si el problema persiste,
          reiniciar los datos de ideas guardados en este navegador.
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={this.handleReload}>
            Recargar
          </Button>
          <Button variant="danger" onClick={this.handleResetData}>
            Reiniciar datos y recargar
          </Button>
        </div>
      </div>
    )
  }
}
