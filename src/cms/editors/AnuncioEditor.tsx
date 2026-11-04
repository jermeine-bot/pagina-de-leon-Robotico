import { Plus, Trash2 } from 'lucide-react'
import { ACTION, primaryButton } from '../theme'
import { Card, EditorShell } from '../ui/EditorShell'
import { Field, Toggle } from '../ui/Field'
import { ImageField } from '../ui/ImageField'
import { useSectionEditor } from '../useSectionEditor'

export function AnuncioEditor({ showToast }: { showToast: (message: string) => void }) {
  const editor = useSectionEditor('announcements', { onSaved: showToast })

  return (
    <EditorShell
      title="Anuncios emergentes"
      description="Ventanas que aparecen al entrar al sitio. Solo se muestran las que estén activas."
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
              {
                enabled: false,
                title: 'Nuevo anuncio',
                text: '',
                image: null,
                cta: 'Ver más',
                link: '#inscripcion',
              },
            ])
          }
          className={primaryButton}
          style={{ background: ACTION }}
        >
          <Plus className="h-4 w-4" /> Añadir anuncio
        </button>
      }
    >
      {editor.draft.map((item, index) => (
        <Card key={index}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Anuncio {index + 1}</p>
            <button
              type="button"
              onClick={() => editor.setDraft(editor.draft.filter((_, i) => i !== index))}
              className="text-red-600 transition hover:text-red-700"
              aria-label={`Eliminar anuncio ${index + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <Toggle
            label="Activar este anuncio"
            checked={item.enabled}
            onChange={(checked) => {
              const next = [...editor.draft]
              next[index] = { ...next[index], enabled: checked }
              editor.setDraft(next)
            }}
          />

          <Field
            label="Título"
            value={item.title}
            onChange={(v) => {
              const next = [...editor.draft]
              next[index] = { ...next[index], title: v }
              editor.setDraft(next)
            }}
            maxLength={160}
          />
          <Field
            label="Texto"
            value={item.text}
            onChange={(v) => {
              const next = [...editor.draft]
              next[index] = { ...next[index], text: v }
              editor.setDraft(next)
            }}
            rows={3}
            maxLength={600}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Texto del botón"
              value={item.cta}
              onChange={(v) => {
                const next = [...editor.draft]
                next[index] = { ...next[index], cta: v }
                editor.setDraft(next)
              }}
              maxLength={60}
            />
            <Field
              label="Enlace del botón"
              value={item.link}
              onChange={(v) => {
                const next = [...editor.draft]
                next[index] = { ...next[index], link: v }
                editor.setDraft(next)
              }}
              hint="Debe empezar por # o por https://"
            />
          </div>
          <ImageField
            label="Imagen (opcional)"
            value={item.image}
            onChange={(v) => {
              const next = [...editor.draft]
              next[index] = { ...next[index], image: v }
              editor.setDraft(next)
            }}
          />
        </Card>
      ))}

      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-xs text-gray-500">
        Si hay varios anuncios activos se muestran uno tras otro. El visitante puede cerrarlos y no vuelven a
        aparecer durante esa sesión.
      </div>
    </EditorShell>
  )
}
