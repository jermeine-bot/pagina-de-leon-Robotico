import { Plus, Trash2 } from 'lucide-react'
import { ACTION, primaryButton } from '../theme'
import { Card, EditorShell } from '../ui/EditorShell'
import { Field } from '../ui/Field'
import { useSectionEditor } from '../useSectionEditor'

export function ProcesoEditor({ showToast }: { showToast: (message: string) => void }) {
  const editor = useSectionEditor('journey', { onSaved: showToast })

  const addStep = () => {
    const step = String(editor.draft.length + 1).padStart(2, '0')
    editor.setDraft([...editor.draft, { step, title: 'NUEVO PASO', text: '' }])
  }

  return (
    <EditorShell
      title="Proceso"
      description="Los pasos del recorrido educativo (imaginar, construir, programar…)."
      dirty={editor.dirty}
      saving={editor.saving}
      error={editor.error}
      conflict={editor.conflict}
      onSave={() => void editor.save()}
      onReset={editor.reset}
      onReload={() => void editor.reload()}
      actions={
        <button type="button" onClick={addStep} className={primaryButton} style={{ background: ACTION }}>
          <Plus className="h-4 w-4" /> Añadir paso
        </button>
      }
    >
      {editor.draft.map((step, index) => (
        <Card key={index}>
          <div className="flex items-end gap-3">
            <div className="w-24">
              <Field
                label="Número"
                value={step.step}
                onChange={(v) => {
                  const next = [...editor.draft]
                  next[index] = { ...next[index], step: v }
                  editor.setDraft(next)
                }}
                maxLength={8}
              />
            </div>
            <div className="flex-1">
              <Field
                label="Título"
                value={step.title}
                onChange={(v) => {
                  const next = [...editor.draft]
                  next[index] = { ...next[index], title: v }
                  editor.setDraft(next)
                }}
                maxLength={80}
              />
            </div>
            <button
              type="button"
              onClick={() => editor.setDraft(editor.draft.filter((_, i) => i !== index))}
              className="mb-3 text-red-600 transition hover:text-red-700"
              aria-label={`Eliminar paso ${index + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <Field
            label="Texto"
            value={step.text}
            onChange={(v) => {
              const next = [...editor.draft]
              next[index] = { ...next[index], text: v }
              editor.setDraft(next)
            }}
            rows={2}
            maxLength={400}
          />
        </Card>
      ))}
    </EditorShell>
  )
}
