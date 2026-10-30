import { useState } from 'react'
import { motion } from 'motion/react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { useCms } from '@/cms/CmsContext'

export function FAQSection() {
  const { data } = useCms()
  const faqs = data.faqs
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="section relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-brand-gray" />
      <div className="container-x grid gap-10 lg:grid-cols-3 lg:items-start">
        <div className="lg:col-span-1">
          <span className="eyebrow" style={{ borderColor: 'rgba(55,200,232,0.3)', background: 'rgba(55,200,232,0.12)', color: '#2563EB' }}>Preguntas</span>
          <h2 className="mt-4 font-display text-4xl font-bold text-brand-deep sm:text-5xl">
            Preguntas frecuentes
          </h2>
          <p className="mt-4 text-brand-deep/70">
            Resolvemos las dudas más comunes sobre el taller. Si falta información oficial, te indicamos dónde consultar.
          </p>
          <div className="mt-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-yellow text-brand-deep shadow-brick">
            <HelpCircle className="h-8 w-8" />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="divide-y divide-brand-deep/10 overflow-hidden rounded-3xl border border-brand-deep/5 bg-white shadow-soft">
            {faqs.map((f, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-brand-gray/60"
                  aria-expanded={open === i}
                >
                  <span className="font-medium text-brand-deep">{f.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-brand-deep/50 transition ${open === i ? 'rotate-180 text-brand-magenta' : ''}`}
                  />
                </button>
                {open === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="px-6 pb-5 text-sm leading-relaxed text-brand-deep/70"
                  >
                    {f.a}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
