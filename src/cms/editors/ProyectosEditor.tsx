import { Plus, Trash2 } from 'lucide-react'
import { ACTION, primaryButton } from '../theme'
import { Card, EditorShell } from '../ui/EditorShell'
import { Field, Select } from '../ui/Field'
import { ImageField } from '../ui/ImageField'
import { useSectionEditor } from '../useSectionEditor'
import { LEVELS, type Level } from '../types'

const LEVEL_OPTIONS = LEVELS.map((level) => ({ value: level, label: level }))

export function ProyectosEditor({ showToast }: { showToast: (message: string) => void }) {
  const editor = useSectionEditor('projects', { onSaved: showToast })

  return (
    <EditorShell
      title="Proyectos"
      description="Ejemplos de retos y proyectos del taller."
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
              { title: 'Nuevo proyecto', level: 'Básico', desc: '', techs: [], image: null },
            ])
          }
          className={primaryButton}
          style={{ background: ACTION }}
        >
          <Plus className="h-4 w-4" /> Añadir proyecto
        </button>
      }
    >
      {editor.draft.map((project, index) => (
        <Card key={index}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Proyecto {index + 1}</p>
            <button
              type="button"
              onClick={() => editor.setDraft(editor.draft.filter((_, i) => i !== index))}
              className="text-red-600 transition hover:text-red-700"
              aria-label={`Eliminar proyecto ${index + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <Field
            label="Título"
            value={project.title}
            onChange={(v) => {
              const next = [...editor.draft]
              next[index] = { ...next[index], title: v }
              editor.setDraft(next)
            }}
            maxLength={160}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Nivel"
              value={project.level}
              options={LEVEL_OPTIONS}
              onChange={(v: Level) => {
                const next = [...editor.draft]
                next[index] = { ...next[index], level: v }
                editor.setDraft(next)
              }}
            />
            <Field
              label="Tecnologías (separadas por coma)"
              value={project.techs.join(', ')}
              onChange={(v) => {
                const next = [...editor.draft]
                next[index] = {
                  ...next[index],
                  techs: v.split(',').map((item) => item.trim()).filter(Boolean).slice(0, 10),
                }
                editor.setDraft(next)
              }}
              placeholder="Sensores, Movimiento"
            />
          </div>
          <Field
            label="Descripción"
            value={project.desc}
            onChange={(v) => {
              const next = [...editor.draft]
              next[index] = { ...next[index], desc: v }
              editor.setDraft(next)
            }}
            rows={2}
            maxLength={600}
          />
          <ImageField
            label="Imagen (opcional)"
            value={project.image}
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
