import { motion } from 'motion/react'
import { useCms } from '@/cms/CmsContext'
import { Zap, Radio, Car, Eye, Cog, Users } from 'lucide-react'

const icons = [Radio, Car, Eye, Zap, Cog, Users]

const levelStyle: Record<string, string> = {
  Básico: 'bg-brand-yellow/25 text-brand-deep border-brand-yellow',
  Intermedio: 'bg-brand-cyan/20 text-brand-deep border-brand-cyan',
  Avanzado: 'bg-brand-magenta/15 text-brand-deep border-brand-magenta',
}

export function ProjectsSection() {
  const { data } = useCms()
  const projects = data.projects
  const techs = data.projectsTechs
  const images = data.projectImages
  return (
    <section id="proyectos" className="section relative overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, #F5F8FC 0%, #FAFAF7 100%)' }} />
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow" style={{ borderColor: 'rgba(55,200,232,0.3)', background: 'rgba(55,200,232,0.12)', color: '#2563EB' }}>Proyectos</span>
          <h2 className="mt-4 font-display text-4xl font-bold text-brand-deep sm:text-5xl">
            Proyectos que despiertan ideas
          </h2>
          <p className="mt-4 text-brand-deep/70">
            Ejemplos educativos de retos posibles. Se identifican como ejemplos hasta confirmar proyectos reales del taller.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => {
            const Icon = icons[i % icons.length]
            return (
              <motion.article
                key={p.title + i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`group relative overflow-hidden rounded-3xl border-2 ${levelStyle[p.level] ?? ''} bg-white transition hover:-translate-y-1 hover:shadow-soft`}
              >
                {images[i] && (
                  <div className="h-36 overflow-hidden">
                    <img src={images[i]!} alt={p.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                  </div>
                )}
                <div className="p-6">
                <div className="flex items-center justify-between">
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${levelStyle[p.level] ?? ''}`}>
                    {p.level}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gray text-brand-blue transition group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-brand-deep">{p.title}</h3>
                <p className="mt-2 text-sm text-brand-deep/70">{p.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(techs[i] || []).map((t) => (
                    <span key={t} className="rounded-full bg-brand-gray px-2.5 py-1 text-xs font-medium text-brand-deep/70">
                      {t}
                    </span>
                  ))}
                </div>
                <div className={`mt-5 h-1.5 w-12 rounded-full transition group-hover:w-20 ${
                  p.level === 'Básico' ? 'bg-brand-yellow' : p.level === 'Intermedio' ? 'bg-brand-cyan' : 'bg-brand-magenta'
                }`} />
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
