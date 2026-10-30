import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Camera, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCms } from '@/cms/CmsContext'

export function WorkshopGallery() {
  const { data } = useCms()
  const items = data.gallery
  const [active, setActive] = useState<number | null>(null)

  const prev = () => setActive((i) => (i === null ? null : (i - 1 + items.length) % items.length))
  const next = () => setActive((i) => (i === null ? null : (i + 1) % items.length))

  return (
    <section id="galeria" className="section relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-brand-warm" />
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="eyebrow" style={{ borderColor: 'rgba(55,200,232,0.3)', background: 'rgba(55,200,232,0.12)', color: '#2563EB' }}>En acción</span>
            <h2 className="mt-4 font-display text-4xl font-bold text-brand-deep sm:text-5xl">
              Nuestro taller en acción
            </h2>
            <p className="mt-3 max-w-xl text-brand-deep/70">
              Fotografías reales del taller se publicarán aquí cuando estén disponibles.
            </p>
          </div>
          <a
            href="#inscripcion"
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-brand-deep/10 bg-white px-5 py-2.5 text-sm font-semibold text-brand-deep transition hover:border-brand-magenta hover:text-brand-magenta"
          >
            Conoce las actividades
          </a>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-3">
          {items.map((it, i) => (
            <motion.button
              key={i}
              onClick={() => setActive(i)}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${it.color} ${
                i % 3 === 0 ? 'row-span-2' : i % 2 === 0 ? 'col-span-2' : ''
              }`}
            >
              {it.image ? (
                <img src={it.image} alt={it.label} className="h-full w-full min-h-[170px] object-cover transition duration-500 group-hover:scale-110" />
              ) : (
                <div className="flex h-full min-h-[170px] flex-col items-center justify-center gap-2 p-6 text-center text-white">
                  <Camera className="h-6 w-6 opacity-80" />
                  <p className="text-sm font-semibold">{it.label}</p>
                  <span className="text-xs opacity-70">Foto próximamente</span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <p className="text-xs font-semibold text-white">{it.label}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-deep/80 p-4 backdrop-blur"
            onClick={() => setActive(null)}
          >
            <button className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white" onClick={() => setActive(null)} aria-label="Cerrar">
              <X className="h-6 w-6" />
            </button>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white" onClick={(e) => { e.stopPropagation(); prev() }} aria-label="Anterior">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white" onClick={(e) => { e.stopPropagation(); next() }} aria-label="Siguiente">
              <ChevronRight className="h-6 w-6" />
            </button>
            <motion.div
              key={active}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative h-[60vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-black"
            >
              {items[active].image ? (
                <img src={items[active].image!} alt={items[active].label} className="h-full w-full object-contain" />
              ) : (
                <div className={`flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br ${items[active].color} text-white`}>
                  <Camera className="h-10 w-10 opacity-80" />
                  <p className="text-xl font-bold">{items[active].label}</p>
                  <span className="text-sm opacity-70">Foto próximamente</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
