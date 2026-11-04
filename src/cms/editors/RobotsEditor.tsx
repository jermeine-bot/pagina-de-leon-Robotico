import { Plus, Trash2 } from 'lucide-react'
import { ACTION, primaryButton } from '../theme'
import { Card, EditorShell } from '../ui/EditorShell'
import { Field, Select } from '../ui/Field'
import { ImageField } from '../ui/ImageField'
import { useSectionEditor } from '../useSectionEditor'
import { LEVELS, type Level } from '../types'

const LEVEL_OPTIONS = LEVELS.map((level) => ({ value: level, label: level }))

export function RobotsEditor({ showToast }: { showToast: (message: string) => void }) {
  const editor = useSectionEditor('kidsRobots', { onSaved: showToast })

  return (
    <EditorShell
      title="Robots de los niños"
      description="Creaciones que los estudiantes podrán construir y programar."
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
          onClick={() =>
            editor.setDraft([
              ...editor.draft,
              { name: 'Nuevo robot', desc: '', level: 'Básico', image: null },
            ])
          }
          className={primaryButton}
          style={{ background: ACTION }}
        >
          <Plus className="h-4 w-4" /> Añadir robot
        </button>
      }
    >
      {editor.draft.map((robot, index) => (
        <Card key={index}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Robot {index + 1}</p>
            <button
              type="button"
              onClick={() => editor.setDraft(editor.draft.filter((_, i) => i !== index))}
              className="text-red-600 transition hover:text-red-700"
              aria-label={`Eliminar robot ${index + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <Field
            label="Nombre"
            value={robot.name}
            onChange={(v) => {
              const next = [...editor.draft]
              next[index] = { ...next[index], name: v }
              editor.setDraft(next)
            }}
            maxLength={120}
          />
          <Field
            label="Descripción"
            value={robot.desc}
            onChange={(v) => {
              const next = [...editor.draft]
              next[index] = { ...next[index], desc: v }
              editor.setDraft(next)
            }}
            rows={2}
            maxLength={600}
          />
          <Select
            label="Nivel"
            value={robot.level}
            options={LEVEL_OPTIONS}
            onChange={(v: Level) => {
              const next = [...editor.draft]
              next[index] = { ...next[index], level: v }
              editor.setDraft(next)
            }}
          />
          <ImageField
            label="Imagen (opcional)"
            value={robot.image}
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
