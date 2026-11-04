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

export function MomentosEditor({ showToast }: { showToast: (message: string) => void }) {
  const editor = useSectionEditor('moments', { onSaved: showToast })

  return (
    <EditorShell
      title="Momentos"
      description="Edita el texto y las actividades que se muestran en el carrusel Momentos."
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
            editor.setDraft({
              ...editor.draft,
              slides: [
                ...editor.draft.slides,
                { tag: 'Nueva actividad', label: '', gradient: 'blue-cyan', image: null },
              ],
            })
          }
          disabled={editor.draft.slides.length >= 30}
          className={primaryButton}
          style={{ background: ACTION }}
        >
          <Plus className="h-4 w-4" /> Añadir actividad
        </button>
      }
    >
      <Card>
        <Field
          label="Etiqueta superior"
          value={editor.draft.eyebrow}
          onChange={(eyebrow) => editor.setDraft({ ...editor.draft, eyebrow })}
          maxLength={120}
        />
        <Field
          label="Título"
          value={editor.draft.title}
          onChange={(title) => editor.setDraft({ ...editor.draft, title })}
          maxLength={160}
        />
        <Field
          label="Descripción"
          value={editor.draft.text}
          onChange={(text) => editor.setDraft({ ...editor.draft, text })}
          rows={4}
          maxLength={1200}
        />
      </Card>
      {editor.draft.slides.map((slide, index) => (
        <Card key={index}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Actividad {index + 1}</p>
            <button
              type="button"
              onClick={() =>
                editor.setDraft({
                  ...editor.draft,
                  slides: editor.draft.slides.filter((_, slideIndex) => slideIndex !== index),
                })
              }
              className="text-red-600 transition hover:text-red-700"
              aria-label={`Eliminar actividad ${index + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <Field
            label="Categoría"
            value={slide.tag}
            onChange={(tag) => {
              const slides = [...editor.draft.slides]
              slides[index] = { ...slide, tag }
              editor.setDraft({ ...editor.draft, slides })
            }}
            maxLength={80}
          />
          <Field
            label="Descripción de la actividad"
            value={slide.label}
            onChange={(label) => {
              const slides = [...editor.draft.slides]
              slides[index] = { ...slide, label }
              editor.setDraft({ ...editor.draft, slides })
            }}
            maxLength={160}
          />
          <Select
            label="Degradado de respaldo"
            value={slide.gradient}
            options={GRADIENT_OPTIONS}
            onChange={(gradient) => {
              const slides = [...editor.draft.slides]
              slides[index] = { ...slide, gradient }
              editor.setDraft({ ...editor.draft, slides })
            }}
            hint="Solo se muestra cuando no hay una fotografía cargada."
          />
          <ImageField
            label="Fotografía (opcional)"
            value={slide.image}
            onChange={(image) => {
              const slides = [...editor.draft.slides]
              slides[index] = { ...slide, image }
              editor.setDraft({ ...editor.draft, slides })
            }}
          />
        </Card>
      ))}
    </EditorShell>
  )
}
