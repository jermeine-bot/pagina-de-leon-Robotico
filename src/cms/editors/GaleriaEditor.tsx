import { Plus, Trash2 } from 'lucide-react'
import { ACTION, primaryButton } from '../theme'
import { Card, EditorShell } from '../ui/EditorShell'
import { Field, Select } from '../ui/Field'
import { ImageField } from '../ui/ImageField'
import { useSectionEditor } from '../useSectionEditor'
import { GRADIENTS, type GradientKey } from '../types'

const GRADIENT_OPTIONS = (Object.keys(GRADIENTS) as GradientKey[]).map((key) => ({
  value: key,
  label: key.replace('-', ' → '),
}))

export function GaleriaEditor({ showToast }: { showToast: (message: string) => void }) {
  const editor = useSectionEditor('gallery', { onSaved: showToast })

  return (
    <EditorShell
      title="Galería"
      description="Fotos del taller. Si no hay imagen se muestra un degradado con la etiqueta."
      dirty={editor.dirty}
      saving={editor.saving}
      error={editor.error}
      conflict={editor.conflict}
      onSave={() => void editor.save()}
      onReset={editor.reset}
      onReload={() => void editor.reload()}
      actions={
        <button
          type="button"
          onClick={() => editor.setDraft([...editor.draft, { label: 'Nueva foto', gradient: 'blue-cyan', image: null }])}
          className={primaryButton}
          style={{ background: ACTION }}
        >
          <Plus className="h-4 w-4" /> Añadir foto
        </button>
      }
    >
      {editor.draft.map((item, index) => (
        <Card key={index}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Foto {index + 1}</p>
            <button
              type="button"
              onClick={() => editor.setDraft(editor.draft.filter((_, i) => i !== index))}
              className="text-red-600 transition hover:text-red-700"
              aria-label={`Eliminar foto ${index + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <Field
            label="Etiqueta"
            value={item.label}
            onChange={(v) => {
              const next = [...editor.draft]
              next[index] = { ...next[index], label: v }
              editor.setDraft(next)
            }}
            maxLength={160}
          />
          <Select
            label="Degradado de respaldo"
            value={item.gradient}
            options={GRADIENT_OPTIONS}
            onChange={(v) => {
              const next = [...editor.draft]
              next[index] = { ...next[index], gradient: v }
              editor.setDraft(next)
            }}
            hint="Solo se usa cuando la foto no está disponible."
          />
          <ImageField
            label="Imagen"
            value={item.image}
            onChange={(v) => {
              const next = [...editor.draft]
              next[index] = { ...next[index], image: v }
              editor.setDraft(next)
            }}
          />
        </Card>
      ))}
    </EditorShell>
  )
}
