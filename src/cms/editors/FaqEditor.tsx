import { Plus, Trash2 } from 'lucide-react'
import { ACTION, primaryButton } from '../theme'
import { Card, EditorShell } from '../ui/EditorShell'
import { Field } from '../ui/Field'
import { useSectionEditor } from '../useSectionEditor'

export function FaqEditor({ showToast }: { showToast: (message: string) => void }) {
  const editor = useSectionEditor('faqs', { onSaved: showToast })

  return (
    <EditorShell
      title="Preguntas frecuentes"
      description="Dudas habituales sobre el taller, edades, inscripción y ubicación."
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
          onClick={() => editor.setDraft([...editor.draft, { q: 'Nueva pregunta', a: '' }])}
          className={primaryButton}
          style={{ background: ACTION }}
        >
          <Plus className="h-4 w-4" /> Añadir pregunta
        </button>
      }
    >
      {editor.draft.map((faq, index) => (
        <Card key={index}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Pregunta {index + 1}</p>
            <button
              type="button"
              onClick={() => editor.setDraft(editor.draft.filter((_, i) => i !== index))}
              className="text-red-600 transition hover:text-red-700"
              aria-label={`Eliminar pregunta ${index + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <Field
            label="Pregunta"
            value={faq.q}
            onChange={(v) => {
              const next = [...editor.draft]
              next[index] = { ...next[index], q: v }
              editor.setDraft(next)
            }}
            maxLength={300}
          />
          <Field
            label="Respuesta"
            value={faq.a}
            onChange={(v) => {
              const next = [...editor.draft]
              next[index] = { ...next[index], a: v }
              editor.setDraft(next)
            }}
            rows={3}
            maxLength={2000}
          />
        </Card>
      ))}
    </EditorShell>
  )
}
