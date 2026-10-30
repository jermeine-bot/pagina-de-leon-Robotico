import { motion } from 'motion/react'
import { Bot, Sparkles, Cpu, Wrench } from 'lucide-react'
import { useCms } from '@/cms/CmsContext'

const icons = [Bot, Wrench, Cpu, Sparkles, Bot, Wrench]

export function KidsRobots() {
  const { data } = useCms()
  const robots = data.kidsRobots
  return (
    <section id="robots" className="section relative overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, #F5F8FC 0%, #FAFAF7 100%)' }} />
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow" style={{ borderColor: 'rgba(37,99,235,0.2)', background: 'rgba(37,99,235,0.08)', color: '#2563EB' }}>Creaciones</span>
          <h2 className="mt-4 font-display text-4xl font-bold text-brand-deep sm:text-5xl">
            Robots que harán los niños
          </h2>
          <p className="mt-4 text-brand-deep/70">
            Ejemplos de los robots que los estudiantes podrán construir y programar durante el taller.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {robots.map((r, i) => {
            const Icon = icons[i % icons.length]
            return (
              <motion.article
                key={r.name + i}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-3xl border border-brand-deep/5 bg-white shadow-soft transition"
              >
                <div className="relative h-44 overflow-hidden bg-gradient-to-br from-brand-blue to-brand-cyan">
                  {r.image ? (
                    <img src={r.image} alt={r.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="h-16 w-16 text-white/90 drop-shadow-lg transition group-hover:scale-110" />
                    </div>
                  )}
                  <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-brand-deep">
                    {r.level}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-brand-deep">{r.name}</h3>
                  <p className="mt-2 text-sm text-brand-deep/70">{r.desc}</p>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
