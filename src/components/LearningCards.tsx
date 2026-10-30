import { motion } from 'motion/react'
import { Blocks, Code2, Cpu, Sparkles } from 'lucide-react'
import { useCms } from '@/cms/CmsContext'

const icons = [Blocks, Code2, Cpu]
const accents = ['from-brand-yellow to-brand-yellow/60', 'from-brand-blue to-brand-blue/60', 'from-brand-magenta to-brand-magenta/60']
const bgs = ['bg-brand-yellow/15', 'bg-brand-cyan/15', 'bg-brand-magenta/10']
const iconBgs = ['bg-brand-yellow', 'bg-brand-blue', 'bg-brand-magenta']

export function LearningCards() {
  const { data } = useCms()
  const cards = data.learningCards
  return (
    <section id="aprender" className="section relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-brand-gray" />
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow" style={{ borderColor: 'rgba(37,99,235,0.2)', background: 'rgba(55,200,232,0.12)', color: '#2563EB' }}>Descubre</span>
          <h2 className="mt-4 font-display text-4xl font-bold text-brand-deep sm:text-5xl">
            {data.intro.title}
          </h2>
          <p className="mt-4 text-lg text-brand-deep/70">{data.intro.text}</p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3 md:grid-rows-2">
          {cards.map((c, i) => (
            <motion.article
              key={c.title + i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`group relative overflow-hidden rounded-3xl border border-brand-deep/5 ${bgs[i % bgs.length]} p-7 transition hover:-translate-y-1 hover:shadow-soft ${
                i === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${iconBgs[i % iconBgs.length]} text-white shadow-brick`}>
                {(() => { const Icon = icons[i % icons.length]; return <Icon className="h-7 w-7" /> })()}
              </div>
              <h3 className={`mt-5 font-display font-bold text-brand-deep ${i === 0 ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>{c.title}</h3>
              <p className={`mt-3 text-brand-deep/70 ${i === 0 ? 'text-lg max-w-md' : ''}`}>{c.text}</p>
              {i === 0 && (
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-brand-blue">
                  <Sparkles className="h-4 w-4" /> Habilidades que desarrollan los niños
                </div>
              )}
              <div className={`mt-6 h-1.5 w-14 rounded-full bg-gradient-to-r ${accents[i % accents.length]} transition group-hover:w-24`} />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
