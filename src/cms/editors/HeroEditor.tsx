import { Card, EditorShell } from '../ui/EditorShell'
import { Field } from '../ui/Field'
import { ImageField } from '../ui/ImageField'
import { useSectionEditor } from '../useSectionEditor'

export function HeroEditor({ showToast }: { showToast: (message: string) => void }) {
  const hero = useSectionEditor('hero', { onSaved: showToast })
  const intro = useSectionEditor('intro', { onSaved: showToast })

  return (
    <div className="space-y-8">
      <EditorShell
        title="Inicio / Hero"
        description="Texto, botones e imagen de la primera pantalla."
        dirty={hero.dirty}
        saving={hero.saving}
        error={hero.error}
        conflict={hero.conflict}
        onSave={() => void hero.save()}
        onReset={hero.reset}
        onReload={() => void hero.reload()}
      >
        <Card>
          <Field label="Eyebrow" value={hero.draft.eyebrow} onChange={(v) => hero.setDraft({ ...hero.draft, eyebrow: v })} maxLength={120} />
          <Field
            label="Título completo"
            value={hero.draft.title}
            onChange={(v) => hero.setDraft({ ...hero.draft, title: v })}
            maxLength={160}
            hint="Ejemplo: El futuro se construye jugando"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Parte resaltada"
              value={hero.draft.highlight}
              onChange={(v) => hero.setDraft({ ...hero.draft, highlight: v })}
              maxLength={80}
              hint="Se subraya en azul dentro del título."
            />
            <Field
              label="Palabra de acento"
              value={hero.draft.accent}
              onChange={(v) => hero.setDraft({ ...hero.draft, accent: v })}
              maxLength={80}
              hint="Se pinta en magenta."
            />
          </div>
          <Field label="Subtítulo" value={hero.draft.subtitle} onChange={(v) => hero.setDraft({ ...hero.draft, subtitle: v })} rows={3} maxLength={600} />
          <Field label="Badge" value={hero.draft.badge} onChange={(v) => hero.setDraft({ ...hero.draft, badge: v })} maxLength={120} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Botón principal" value={hero.draft.ctaPrimary} onChange={(v) => hero.setDraft({ ...hero.draft, ctaPrimary: v })} maxLength={60} />
            <Field label="Botón secundario" value={hero.draft.ctaSecondary} onChange={(v) => hero.setDraft({ ...hero.draft, ctaSecondary: v })} maxLength={60} />
          </div>
          <ImageField
            label="Imagen de fondo del hero (opcional)"
            value={hero.draft.image}
            onChange={(v) => hero.setDraft({ ...hero.draft, image: v })}
            hint="El modelo 3D se mantiene encima de la imagen."
          />
        </Card>
      </EditorShell>

      <EditorShell
        title="Introducción"
        description="Bloque de texto que acompaña a las tarjetas de aprendizaje."
        dirty={intro.dirty}
        saving={intro.saving}
        error={intro.error}
        conflict={intro.conflict}
        onSave={() => void intro.save()}
        onReset={intro.reset}
        onReload={() => void intro.reload()}
      >
        <Card>
          <Field label="Título" value={intro.draft.title} onChange={(v) => intro.setDraft({ ...intro.draft, title: v })} maxLength={160} />
          <Field label="Descripción" value={intro.draft.text} onChange={(v) => intro.setDraft({ ...intro.draft, text: v })} rows={4} maxLength={1200} />
        </Card>
      </EditorShell>
    </div>
  )
}
