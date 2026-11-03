import { useState } from 'react'
import { motion } from 'motion/react'
import { CheckCircle2, Send } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

type FormState = {
  tutor: string
  participant: string
  age: string
  grade: string
  school: string
  contact: string
  email: string
  message: string
  privacy: boolean
}

type Errors = Partial<Record<keyof FormState, string>>

export function RegistrationForm() {
  const [form, setForm] = useState<FormState>({
    tutor: '',
    participant: '',
    age: '',
    grade: '',
    school: '',
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
    if (!form.participant.trim()) e.participant = 'Ingresa el nombre del participante.'
    if (!form.age.trim()) e.age = 'Ingresa la edad del niño o niña.'
    else if (!/^\d{1,2}$/.test(form.age.trim())) e.age = 'Ingresa una edad válida.'
    if (!form.grade.trim()) e.grade = 'Ingresa el grado o nivel.'
    if (!form.school.trim()) e.school = 'Ingresa el nombre del colegio o escuela.'
    if (!form.contact.trim()) e.contact = 'Ingresa un medio de contacto.'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Correo electrónico no válido.'
    if (!form.privacy) e.privacy = 'Debes aceptar el aviso de privacidad.'
    return e
  }

  const generatePDFAndRedirect = (data: FormState) => {
    const doc = new jsPDF()

    // Encabezado del PDF
    doc.setFontSize(18)
    doc.setTextColor(40, 40, 40)
    doc.text('Solicitud de Inscripción', 14, 22)

    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-NI')}`, 14, 30)

    // Tabla con los datos completos del formulario incluyendo grado y colegio
    autoTable(doc, {
      startY: 36,
      head: [['Campo', 'Detalle']],
      body: [
        ['Tutor / Padre / Madre', data.tutor],
        ['Participante (Protagonista)', data.participant],
        ['Edad', `${data.age} años`],
        ['Grado / Nivel', data.grade],
        ['Colegio / Escuela', data.school],
        ['Medio de Contacto', data.contact],
        ['Correo Electrónico', data.email || 'No proporcionado'],
        ['Mensaje / Consulta', data.message || 'Sin mensaje adicional'],
      ],
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] },
    })

    // Descargar el PDF localmente
    const fileName = `Inscripcion_${data.participant.replace(/\s+/g, '_')}.pdf`
    doc.save(fileName)

    // Formatear mensaje para WhatsApp con los nuevos datos
    const phone = '50581073392'
    const textMessage = 
`*NUEVA SOLICITUD DE INSCRIPCIÓN* 📄

*Tutor:* ${data.tutor}
*Participante:* ${data.participant}
*Edad:* ${data.age} años
*Grado:* ${data.grade}
*Colegio:* ${data.school}
*Contacto:* ${data.contact}
*Email:* ${data.email || 'N/A'}
*Mensaje:* ${data.message || 'Sin mensaje'}

_(El comprobante PDF se ha descargado en mi dispositivo y lo adjunto a continuación)_`

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(textMessage)}`
    
    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank')
  }

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length > 0) return
    setSubmitting(true)

    try {
      generatePDFAndRedirect(form)
      setSubmitted(true)
    } catch (err) {
      console.error('Error al procesar la solicitud:', err)
    } finally {
      setSubmitting(false)
    }
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
            <h2 className="mt-4 font-display text-2xl font-bold text-brand-deep">Solicitud lista para WhatsApp</h2>
            <p className="mt-3 text-brand-deep/70">
              Se ha generado y descargado el archivo PDF en tu equipo, y se ha abierto WhatsApp para enviar los datos al +505 81073392.
            </p>
            <button
              onClick={() => { 
                setSubmitted(false)
                setForm({ tutor: '', participant: '', age: '', grade: '', school: '', contact: '', email: '', message: '', privacy: false }) 
              }}
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
           Matricula a tu hijo o hija en nuestro taller y acompáñalo en su viaje hacia la innovación y el aprendizaje práctico.
          </p>
          <h2>Importante <span>llevar partida de nacimiento física</span></h2>
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
              <label className="mb-1.5 block text-sm font-medium text-brand-deep">Nombre del protagonista (participante)</label>
              <input
                type="text"
                {...field('participant')}
                className="w-full rounded-xl border border-brand-deep/15 px-4 py-2.5 text-sm outline-none focus:border-brand-blue"
              />
              {errors.participant && <p className="mt-1 text-xs text-red-600">{errors.participant}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-brand-deep">Edad</label>
                <input
                  type="text"
                  inputMode="numeric"
                  {...field('age')}
                  className="w-full rounded-xl border border-brand-deep/15 px-4 py-2.5 text-sm outline-none focus:border-brand-blue"
                />
                {errors.age && <p className="mt-1 text-xs text-red-600">{errors.age}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-brand-deep">Grado / Nivel</label>
                <input
                  type="text"
                  placeholder="Ej. 5to Primaria"
                  {...field('grade')}
                  className="w-full rounded-xl border border-brand-deep/15 px-4 py-2.5 text-sm outline-none focus:border-brand-blue"
                />
                {errors.grade && <p className="mt-1 text-xs text-red-600">{errors.grade}</p>}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-deep">Colegio o Escuela</label>
              <input
                type="text"
                placeholder="Nombre de la institución educativa"
                {...field('school')}
                className="w-full rounded-xl border border-brand-deep/15 px-4 py-2.5 text-sm outline-none focus:border-brand-blue"
              />
              {errors.school && <p className="mt-1 text-xs text-red-600">{errors.school}</p>}
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
              {submitting ? 'Generando PDF...' : 'Enviar por WhatsApp'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}