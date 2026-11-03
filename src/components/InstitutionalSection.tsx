import { motion } from 'motion/react'
import { Building2, GraduationCap, MapPin, Clock, Users, Sparkles } from 'lucide-react'
import { useCms } from '@/cms/CmsContext'

export function InstitutionalSection() {
  const { data } = useCms() as { data: any }

  // Rutas directas desde la carpeta public en la raíz
  const partners = data?.partners || [
    { name: 'Alcaldía Municipal', logo: '/leon2d.png' },
    { name: 'Ministerio de Educación', logo: '/mined.png' },
    { name: 'Instituto de Tecnología', logo: '/unan.png' },
    { name: 'Fundación Aliada', logo: '/leoncito.jpg' },
  ]

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
              Invertimos en ideas que construyen el futuro
            </h2>
            <p className="mt-4 text-lg text-brand-deep/70">
              El taller es una iniciativa educativa de la {data?.municipality || 'Alcaldía'} para acercar a los niños a la
              ciencia, la tecnología, la ingeniería y las matemáticas mediante experiencias educativas accesibles y
              prácticas.
            </p>
            <p className="mt-4 text-brand-deep/70">
              No se inventan cifras de impacto ni convenios. Los datos oficiales se incorporarán cuando sean confirmados.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                { icon: GraduationCap, label: 'Programa educativo STEM', color: 'text-brand-blue' },
                { icon: Building2, label: 'Iniciativa de la Alcaldía', color: 'text-brand-cyan' },
                { icon: Users, label: 'Aprendizaje colaborativo', color: 'text-brand-magenta' },
                { icon: Sparkles, label: 'Innovación para la niñez', color: 'text-brand-yellow' },
              ].map((it) => (
                <div key={it.label} className="flex items-center gap-3 rounded-2xl border border-brand-deep/5 bg-white p-3.5 shadow-soft">
                  <it.icon className={`h-5 w-5 ${it.color}`} />
                  <span className="text-sm font-medium text-brand-deep/80">{it.label}</span>
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
            {data?.institutionalImage && (
              <img src={data.institutionalImage} alt="Institucional" className="mb-4 h-40 w-full rounded-2xl object-cover" />
            )}
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-2xl bg-brand-yellow/30" />
            <div className="absolute -left-4 bottom-8 h-16 w-16 rounded-xl bg-brand-cyan/30" />

            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue text-white shadow-glow">
                  <Building2 className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm text-brand-deep/60">Programa oficial</p>
                  <p className="font-display text-xl font-bold text-brand-deep">{data?.programName}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm text-brand-deep/80">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand-magenta" />
                  <span>Ubicación: por confirmar con la Alcaldía.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-brand-magenta" />
                  <span>Horarios y edades admitidas: por confirmar.</span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-dashed border-brand-deep/15 bg-brand-gray p-4 text-xs text-brand-deep/60">
                Espacio reservado para el logotipo oficial de la Alcaldía y el nombre oficial del programa.
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- Sección de las 4 Instituciones de Apoyo --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-brand-deep/5 bg-white/60 p-8 backdrop-blur-sm shadow-soft"
        >
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-brand-deep/50 mb-6">
            Instituciones que hacen posible este proyecto
          </p>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 items-center justify-items-center">
            {partners.slice(0, 4).map((partner: any, index: number) => (
              <div
                key={index}
                className="flex h-24 w-full items-center justify-center rounded-2xl border border-brand-deep/5 bg-white p-4 transition-transform hover:scale-105 shadow-sm"
              >
                {partner.logo ? (
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-12 max-w-full object-contain transition-all"
                  />
                ) : (
                  <span className="text-xs font-semibold text-brand-deep/60 text-center">{partner.name}</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}