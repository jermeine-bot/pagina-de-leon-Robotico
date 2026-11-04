import type { ReactNode } from 'react'
import { AlertTriangle, Loader2, RefreshCw, RotateCcw, Save } from 'lucide-react'
import { ACTION, NAVY, primaryButton, secondaryButton } from '../theme'

type Props = {
  title: string
  description?: string
  dirty: boolean
  saving: boolean
  error: string
  conflict: boolean
  onSave: () => void
  onReset: () => void
  onReload: () => void
  children: ReactNode
  actions?: ReactNode
}

export function EditorShell({
  title,
  description,
  dirty,
  saving,
  error,
  conflict,
  onSave,
  onReset,
  onReload,
  children,
  actions,
}: Props) {
  return (
    <div className="space-y-4 pb-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: NAVY }}>
            {title}
          </h1>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {actions}
          <button type="button" onClick={onReset} disabled={!dirty || saving} className={secondaryButton}>
            <RotateCcw className="h-4 w-4" /> Descartar
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!dirty || saving}
            className={primaryButton}
            style={{ background: ACTION }}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </div>

      {dirty && !saving && (
        <p className="text-xs font-medium text-amber-700">Tienes cambios sin guardar.</p>
      )}

      {error && (
        <div
          className={`flex flex-col gap-2 rounded-xl border p-4 text-sm sm:flex-row sm:items-center sm:justify-between ${
            conflict ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
          </span>
          {conflict && (
            <button type="button" onClick={onReload} className={secondaryButton} disabled={saving}>
              <RefreshCw className="h-4 w-4" /> Recargar versión actual
            </button>
          )}
        </div>
      )}

      {children}
    </div>
  )
}

export function Card({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      {title && (
        <h2 className="font-display text-lg font-bold" style={{ color: NAVY }}>
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}
