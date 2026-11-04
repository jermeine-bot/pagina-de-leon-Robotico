import { Plus, Trash2 } from 'lucide-react'
import { ACTION, primaryButton } from '../theme'
import { Card, EditorShell } from '../ui/EditorShell'
import { Field } from '../ui/Field'
import { ImageField } from '../ui/ImageField'
import { useSectionEditor } from '../useSectionEditor'

export function InstitucionalEditor({ showToast }: { showToast: (message: string) => void }) {
  const editor = useSectionEditor('institutional', { onSaved: showToast })

  return (
    <EditorShell
      title="Institucional"
      description="Texto, imagen y aliados que respaldan el taller."
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
              partners: [...editor.draft.partners, { name: 'Nuevo aliado', logo: null }],
            })
          }
          className={primaryButton}
          style={{ background: ACTION }}
        >
          <Plus className="h-4 w-4" /> Añadir aliado
        </button>
      }
    >
      <Card title="Mensaje institucional">
        <Field
          label="Título"
          value={editor.draft.heading}
          onChange={(v) => editor.setDraft({ ...editor.draft, heading: v })}
          maxLength={160}
        />
        <Field
          label="Texto"
          value={editor.draft.text}
          onChange={(v) => editor.setDraft({ ...editor.draft, text: v })}
          rows={5}
          maxLength={1200}
        />
        <ImageField
          label="Imagen institucional (opcional)"
          value={editor.draft.image}
          onChange={(v) => editor.setDraft({ ...editor.draft, image: v })}
        />
      </Card>

      {editor.draft.partners.map((partner, index) => (
        <Card key={index}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Aliado {index + 1}</p>
            <button
              type="button"
              onClick={() =>
                editor.setDraft({
                  ...editor.draft,
                  partners: editor.draft.partners.filter((_, i) => i !== index),
                })
              }
              className="text-red-600 transition hover:text-red-700"
              aria-label={`Eliminar aliado ${index + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <Field
            label="Nombre"
            value={partner.name}
            onChange={(v) => {
              const partners = [...editor.draft.partners]
              partners[index] = { ...partners[index], name: v }
              editor.setDraft({ ...editor.draft, partners })
            }}
            maxLength={120}
          />
          <ImageField
            label="Logotipo"
            value={partner.logo}
            onChange={(v) => {
              const partners = [...editor.draft.partners]
              partners[index] = { ...partners[index], logo: v }
              editor.setDraft({ ...editor.draft, partners })
            }}
            hint="Si no hay logotipo se muestra el nombre del aliado."
          />
        </Card>
      ))}
    </EditorShell>
  )
}
