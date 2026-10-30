import { motion } from 'motion/react'
import { Lightbulb, Hammer, Code2, FlaskConical, Users } from 'lucide-react'
import { useCms } from '@/cms/CmsContext'

const icons = [Lightbulb, Hammer, Code2, FlaskConical, Users]
const colors = ['bg-brand-yellow', 'bg-brand-blue', 'bg-brand-cyan', 'bg-brand-magenta', 'bg-brand-deep']

export function LearningJourney() {
  const { data } = useCms()
  const journey = data.journey
  return (
    <section id="proceso" className="section relative overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, #FAFAF7 0%, #EEF6FF 100%)' }} />
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow" style={{ borderColor: 'rgba(232,62,153,0.25)', background: 'rgba(232,62,153,0.1)', color: '#E83E99' }}>Proceso</span>
          <h2 className="mt-4 font-display text-4xl font-bold text-brand-deep sm:text-5xl">Aprende haciendo</h2>
          <p className="mt-4 text-brand-deep/70">
            Un recorrido visual del proceso educativo: imaginar, construir, programar, experimentar y compartir.
          </p>
        </div>

        <div className="mt-16">
          <div className="relative">
            <div className="absolute left-0 right-0 top-8 hidden h-1 rounded-full bg-gradient-to-r from-brand-yellow via-brand-blue via-brand-cyan to-brand-magenta md:block" />

            <div className="grid gap-8 md:grid-cols-5">
              {journey.map((j, i) => {
                const Icon = icons[i % icons.length]
                return (
                  <motion.div
                    key={j.step + i}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="relative flex flex-col items-center text-center"
                  >
                    <div className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl ${colors[i % colors.length]} text-white shadow-brick transition hover:scale-110`}>
                      <Icon className="h-7 w-7" />
                      <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-brand-deep shadow-soft">
                        {j.step}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold text-brand-deep">{j.title}</h3>
                    <p className="mt-2 text-sm text-brand-deep/70">{j.text}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
