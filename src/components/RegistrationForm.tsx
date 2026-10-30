import { useState } from 'react'
import { motion } from 'motion/react'
import { CheckCircle2, Send } from 'lucide-react'

type FormState = {
  tutor: string
  age: string
  contact: string
  email: string
  message: string
  privacy: boolean
}

type Errors = Partial<Record<keyof FormState, string>>

export function RegistrationForm() {
  const [form, setForm] = useState<FormState>({
    tutor: '',
    age: '',
    contact: '',
    email: '',
    message: '',
    privacy: false,
  })
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const validate = (): Errors => {
    const e: Errors = {}
    if (!form.tutor.trim()) e.tutor = 'Ingresa el nombre del padre, madre o tutor.'
    if (!form.age.trim()) e.age = 'Ingresa la edad del niño o niña.'
    else if (!/^\d{1,2}$/.test(form.age.trim())) e.age = 'Ingresa una edad válida.'
    if (!form.contact.trim()) e.contact = 'Ingresa un medio de contacto.'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Correo electrónico no válido.'
    if (!form.privacy) e.privacy = 'Debes aceptar el aviso de privacidad.'
    return e
  }

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length > 0) return
    setSubmitting(true)
    // No backend connected: simulate a short delay, then show confirmation.
    // NOTE: data is NOT stored or sent anywhere yet.
    await new Promise((r) => setTimeout(r, 700))
    setSubmitting(false)
    setSubmitted(true)
  }

  const field = (key: keyof FormState) => ({
    value: form[key] as string,
    onChange: (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const target = ev.target
      const value = target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : target.value
      setForm((f) => ({ ...f, [key]: value }))
    },
  })

  if (submitted) {
    return (
      <section id="inscripcion" className="section">
        <div className="container-x">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-xl rounded-3xl border border-brand-magenta/30 bg-brand-magenta/10 p-10 text-center"
          >
            <CheckCircle2 className="mx-auto h-12 w-12 text-brand-magenta" />
            <h2 className="mt-4 font-display text-2xl font-bold text-brand-deep">Solicitud registrada (demo)</h2>
            <p className="mt-3 text-brand-deep/70">
              Esta es una demostración: el formulario aún no está conectado a un backend, por lo que la solicitud no
              se almacena ni se envía. Para habilitar el envío real, conecta el formulario a un servicio de correo o
              API.
            </p>
            <button
              onClick={() => { setSubmitted(false); setForm({ tutor: '', age: '', contact: '', email: '', message: '', privacy: false }) }}
              className="mt-6 rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white"
            >
              Enviar otra solicitud
            </button>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="inscripcion" className="section bg-brand-gray/60">
      <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <span className="eyebrow">Inscripción</span>
          <h2 className="mt-4 font-display text-4xl font-bold text-brand-deep sm:text-5xl">
            ¿Listos para crear algo extraordinario?
          </h2>
          <p className="mt-4 text-lg text-brand-deep/70">
            Orientación para padres, madres o tutores interesados en el programa. Protegemos los datos de menores y
            solo solicitamos la información necesaria.
          </p>
          <div className="mt-6 rounded-2xl border border-brand-yellow/30 bg-brand-yellow/10 p-4 text-sm text-brand-deep/80">
            Aviso: el formulario aún no está conectado a un backend. Las solicitudes no se almacenan ni se envían
            hasta habilitar la integración.
          </div>
        </div>

        <form onSubmit={onSubmit} noValidate className="rounded-3xl border border-brand-deep/5 bg-white p-7 shadow-soft">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-deep">Nombre del padre, madre o tutor</label>
              <input
                type="text"
                {...field('tutor')}
                className="w-full rounded-xl border border-brand-deep/15 px-4 py-2.5 text-sm outline-none focus:border-brand-blue"
              />
              {errors.tutor && <p className="mt-1 text-xs text-red-600">{errors.tutor}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-deep">Edad del niño o niña</label>
              <input
                type="text"
                inputMode="numeric"
                {...field('age')}
                className="w-full rounded-xl border border-brand-deep/15 px-4 py-2.5 text-sm outline-none focus:border-brand-blue"
              />
              {errors.age && <p className="mt-1 text-xs text-red-600">{errors.age}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-deep">Medio de contacto</label>
              <input
                type="text"
                placeholder="Teléfono o WhatsApp"
                {...field('contact')}
                className="w-full rounded-xl border border-brand-deep/15 px-4 py-2.5 text-sm outline-none focus:border-brand-blue"
              />
              {errors.contact && <p className="mt-1 text-xs text-red-600">{errors.contact}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-deep">Correo electrónico (opcional)</label>
              <input
                type="email"
                {...field('email')}
                className="w-full rounded-xl border border-brand-deep/15 px-4 py-2.5 text-sm outline-none focus:border-brand-blue"
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-deep">Mensaje o consulta</label>
              <textarea
                rows={4}
                {...field('message')}
                className="w-full rounded-xl border border-brand-deep/15 px-4 py-2.5 text-sm outline-none focus:border-brand-blue"
              />
            </div>

            <label className="flex items-start gap-2 text-sm text-brand-deep/80">
              <input
                type="checkbox"
                checked={form.privacy}
                onChange={(e) => setForm((f) => ({ ...f, privacy: e.target.checked }))}
                className="mt-1"
              />
              Acepto el aviso de privacidad y el tratamiento de los datos proporcionados.
            </label>
            {errors.privacy && <p className="text-xs text-red-600">{errors.privacy}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-blue/90 disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {submitting ? 'Enviando...' : 'Solicitar información'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
