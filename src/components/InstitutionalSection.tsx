import { motion } from 'motion/react'
import { Building2, GraduationCap, MapPin, Clock, Users, Sparkles } from 'lucide-react'
import { useCms } from '@/cms/CmsContext'

const FEATURES = [
  { icon: GraduationCap, label: 'Programa educativo STEM', color: 'text-brand-blue' },
  { icon: Building2, label: 'Iniciativa de la Alcaldía', color: 'text-brand-cyan' },
  { icon: Users, label: 'Aprendizaje colaborativo', color: 'text-brand-magenta' },
  { icon: Sparkles, label: 'Innovación para la niñez', color: 'text-brand-yellow' },
]

export function InstitutionalSection() {
  const { data } = useCms()
  const { institutional, settings, contact } = data

  return (
    <section id="institucional" className="section relative overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, #FAFAF7 0%, #EEF9FC 100%)' }} />

      <div className="container-x space-y-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow" style={{ borderColor: 'rgba(37,99,235,0.2)', background: 'rgba(37,99,235,0.08)', color: '#2563EB' }}>Institucional</span>
            <h2 className="mt-4 font-display text-4xl font-bold text-brand-deep sm:text-5xl">
              {institutional.heading}
            </h2>
            <p className="mt-4 text-lg text-brand-deep/70">{institutional.text}</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {FEATURES.map((feature) => (
                <div key={feature.label} className="flex items-center gap-3 rounded-2xl border border-brand-deep/5 bg-white p-3.5 shadow-soft">
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                  <span className="text-sm font-medium text-brand-deep/80">{feature.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl border border-brand-deep/5 bg-white p-8 shadow-soft"
          >
            {institutional.image && (
              <img src={institutional.image} alt="Institucional" className="mb-4 h-40 w-full rounded-2xl object-cover" />
            )}
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-2xl bg-brand-yellow/30" />
            <div className="absolute -left-4 bottom-8 h-16 w-16 rounded-xl bg-brand-cyan/30" />

            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue text-white shadow-glow">
                  <Building2 className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm text-brand-deep/60">{settings.municipality}</p>
                  <p className="font-display text-xl font-bold text-brand-deep">{settings.programName}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm text-brand-deep/80">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-magenta" />
                  <span>{contact.address ?? 'Ubicación por confirmar con la Alcaldía.'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0 text-brand-magenta" />
                  <span>Horarios y edades admitidas: consulta con el taller.</span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-dashed border-brand-deep/15 bg-brand-gray p-4 text-xs text-brand-deep/60">
                Espacio reservado para el logotipo oficial de la Alcaldía y el nombre oficial del programa.
              </div>
            </div>
          </motion.div>
        </div>

        {institutional.partners.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-brand-deep/5 bg-white/60 p-8 shadow-soft backdrop-blur-sm sm:p-10"
          >
            <p className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-brand-deep/50">
              Instituciones que hacen posible este proyecto
            </p>
            <div className="grid grid-cols-1 items-center justify-items-center gap-8 sm:grid-cols-2">
              {institutional.partners.map((partner, index) => (
                <div
                  key={`${partner.name}-${index}`}
                  className="flex h-36 w-full items-center justify-center rounded-2xl border border-brand-deep/5 bg-white p-6 shadow-sm transition-transform hover:scale-105 sm:h-44"
                >
                  {partner.logo ? (
                    <img src={partner.logo} alt={partner.name} className="max-h-28 max-w-full object-contain transition-all sm:max-h-32" />
                  ) : (
                    <span className="text-center text-base font-semibold text-brand-deep/60">{partner.name}</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
