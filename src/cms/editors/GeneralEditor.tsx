import { useRef, useState } from 'react'
import { AlertTriangle, Download, KeyRound, Loader2, RotateCcw, Upload } from 'lucide-react'
import { ApiError } from '@/api/client'
import { useCms } from '../CmsContext'
import { ACTION, NAVY, primaryButton, secondaryButton } from '../theme'
import { Card, EditorShell } from '../ui/EditorShell'
import { Field } from '../ui/Field'
import { useSectionEditor } from '../useSectionEditor'

export function GeneralEditor({ showToast }: { showToast: (message: string) => void }) {
  const settings = useSectionEditor('settings', { onSaved: showToast })
  const contact = useSectionEditor('contact', { onSaved: showToast })

  return (
    <div className="space-y-8">
      <EditorShell
        title="Datos del programa"
        description="Nombre oficial, institución responsable y lema que aparecen en el sitio."
        dirty={settings.dirty}
        saving={settings.saving}
        error={settings.error}
        conflict={settings.conflict}
        onSave={() => void settings.save()}
        onReset={settings.reset}
        onReload={() => void settings.reload()}
      >
        <Card>
          <Field
            label="Nombre del programa"
            value={settings.draft.programName}
            onChange={(v) => settings.setDraft({ ...settings.draft, programName: v })}
            maxLength={120}
          />
          <Field
            label="Institución / municipalidad"
            value={settings.draft.municipality}
            onChange={(v) => settings.setDraft({ ...settings.draft, municipality: v })}
            maxLength={120}
          />
          <Field
            label="Lema"
            value={settings.draft.tagline}
            onChange={(v) => settings.setDraft({ ...settings.draft, tagline: v })}
            maxLength={160}
          />
        </Card>
      </EditorShell>

      <EditorShell
        title="Contacto"
        description="Datos de contacto mostrados en el pie del sitio y en la sección de inscripción."
        dirty={contact.dirty}
        saving={contact.saving}
        error={contact.error}
        conflict={contact.conflict}
        onSave={() => void contact.save()}
        onReset={contact.reset}
        onReload={() => void contact.reload()}
      >
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Correo electrónico"
              type="email"
              value={contact.draft.email ?? ''}
              onChange={(v) => contact.setDraft({ ...contact.draft, email: v.trim() || null })}
              maxLength={160}
            />
            <Field
              label="Teléfono"
              value={contact.draft.phone ?? ''}
              onChange={(v) => contact.setDraft({ ...contact.draft, phone: v.trim() || null })}
              maxLength={40}
            />
          </div>
          <Field
            label="WhatsApp"
            value={contact.draft.whatsapp ?? ''}
            onChange={(v) =>
              contact.setDraft({ ...contact.draft, whatsapp: v.replace(/[^0-9]/g, '') || null })
            }
            maxLength={20}
            hint="Solo números, con código de país. Ejemplo: 50581073392"
          />
          <Field
            label="Dirección"
            value={contact.draft.address ?? ''}
            onChange={(v) => contact.setDraft({ ...contact.draft, address: v.trim() || null })}
            rows={2}
            maxLength={300}
          />
        </Card>
      </EditorShell>

      <PasswordCard showToast={showToast} />
      <BackupCard showToast={showToast} />
    </div>
  )
}

function PasswordCard({ showToast }: { showToast: (message: string) => void }) {
  const { changePassword } = useCms()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage('')

    if (next !== confirm) {
      setMessage('La confirmación no coincide con la nueva contraseña.')

      return
    }
    if (next.length < 12) {
      setMessage('La nueva contraseña debe tener al menos 12 caracteres.')

      return
    }

    setSaving(true)
    try {
      await changePassword(current, next)
      setCurrent('')
      setNext('')
      setConfirm('')
      showToast('Contraseña actualizada')
    } catch (caught) {
      setMessage(caught instanceof ApiError ? caught.message : 'No se pudo cambiar la contraseña.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="flex items-center gap-2 font-display text-lg font-bold" style={{ color: NAVY }}>
          <KeyRound className="h-5 w-5" /> Cambiar contraseña
        </h2>
        <p className="mt-1 text-sm text-gray-500">La sesión se mantiene activa después del cambio.</p>
      </div>
      <form onSubmit={(event) => void submit(event)} className="space-y-4">
        <Field label="Contraseña actual" type="password" value={current} onChange={setCurrent} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Nueva contraseña"
            type="password"
            value={next}
            onChange={setNext}
            hint="Mínimo 12 caracteres."
          />
          <Field label="Repetir nueva contraseña" type="password" value={confirm} onChange={setConfirm} />
        </div>
        {message && (
          <p className="flex items-center gap-2 text-sm text-red-600">
            <AlertTriangle className="h-4 w-4" /> {message}
          </p>
        )}
        <button
          type="submit"
          disabled={saving || current === '' || next === '' || confirm === ''}
          className={primaryButton}
          style={{ background: ACTION }}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
          {saving ? 'Guardando…' : 'Actualizar contraseña'}
        </button>
      </form>
    </section>
  )
}

function BackupCard({ showToast }: { showToast: (message: string) => void }) {
  const { exportContent, importContent, reset } = useCms()
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  const handleExport = async () => {
    setBusy(true)
    setMessage('')
    try {
      const content = await exportContent()
      const blob = new Blob([JSON.stringify({ content, exportedAt: new Date().toISOString() }, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `contenido-robotica-${new Date().toISOString().slice(0, 10)}.json`
      link.click()
      URL.revokeObjectURL(url)
      showToast('Respaldo descargado')
    } catch (caught) {
      setMessage(caught instanceof ApiError ? caught.message : 'No se pudo generar el respaldo.')
    } finally {
      setBusy(false)
    }
  }

  const handleImport = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    setMessage('')

    try {
      const parsed = JSON.parse(await file.text()) as { content?: unknown } | Record<string, unknown>
      const content =
        parsed && typeof parsed === 'object' && 'content' in parsed && parsed.content
          ? parsed.content
          : parsed

      await importContent(content as Parameters<typeof importContent>[0])
      showToast('Respaldo importado')
    } catch (caught) {
      if (caught instanceof ApiError) {
        setMessage(caught.message)
      } else if (caught instanceof SyntaxError) {
        setMessage('El archivo no es un JSON válido.')
      } else {
        setMessage('No se pudo importar el respaldo.')
      }
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleReset = async () => {
    if (!confirm('Se restaurará todo el contenido a los valores iniciales. ¿Continuar?')) return
    setBusy(true)
    setMessage('')
    try {
      await reset()
      showToast('Contenido restaurado')
    } catch (caught) {
      setMessage(caught instanceof ApiError ? caught.message : 'No se pudo restaurar el contenido.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="font-display text-lg font-bold" style={{ color: NAVY }}>
          Respaldo del contenido
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Descarga una copia en JSON, restaura desde un archivo o vuelve al contenido inicial.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => void handleExport()} disabled={busy} className={secondaryButton}>
          <Download className="h-4 w-4" /> Exportar JSON
        </button>
        <label className={`${secondaryButton} cursor-pointer`}>
          <Upload className="h-4 w-4" /> Importar JSON
          <input
            ref={inputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            disabled={busy}
            onChange={(event) => void handleImport(event.target.files?.[0])}
          />
        </label>
        <button
          type="button"
          onClick={() => void handleReset()}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCcw className="h-4 w-4" /> Restaurar contenido inicial
        </button>
      </div>

      {message && (
        <p className="flex items-center gap-2 text-sm text-red-600">
          <AlertTriangle className="h-4 w-4" /> {message}
        </p>
      )}
    </section>
  )
}
