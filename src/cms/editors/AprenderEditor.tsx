import { Plus, Trash2 } from 'lucide-react'
import { ACTION, primaryButton } from '../theme'
import { Card, EditorShell } from '../ui/EditorShell'
import { Field } from '../ui/Field'
import { useSectionEditor } from '../useSectionEditor'

export function AprenderEditor({ showToast }: { showToast: (message: string) => void }) {
  const editor = useSectionEditor('learningCards', { onSaved: showToast })

  return (
    <EditorShell
      title="Aprender"
      description="Tarjetas con las habilidades que desarrollan los niños."
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
          onClick={() => editor.setDraft([...editor.draft, { title: 'Nueva tarjeta', text: '' }])}
          className={primaryButton}
          style={{ background: ACTION }}
        >
          <Plus className="h-4 w-4" /> Añadir tarjeta
        </button>
      }
    >
      {editor.draft.map((card, index) => (
        <Card key={index}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Tarjeta {index + 1}</p>
            <button
              type="button"
              onClick={() => editor.setDraft(editor.draft.filter((_, i) => i !== index))}
              className="text-red-600 transition hover:text-red-700"
              aria-label={`Eliminar tarjeta ${index + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <Field
            label="Título"
            value={card.title}
            onChange={(v) => {
              const next = [...editor.draft]
              next[index] = { ...next[index], title: v }
              editor.setDraft(next)
            }}
            maxLength={120}
          />
          <Field
            label="Texto"
            value={card.text}
            onChange={(v) => {
              const next = [...editor.draft]
              next[index] = { ...next[index], text: v }
              editor.setDraft(next)
            }}
            rows={3}
            maxLength={600}
          />
        </Card>
      ))}
    </EditorShell>
  )
}
