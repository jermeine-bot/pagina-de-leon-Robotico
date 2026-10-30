import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react'

const slides = [
  { label: 'Niños construyendo su primer robot', color: 'from-brand-blue to-brand-cyan', tag: 'Construcción' },
  { label: 'Programando movimientos con bloques', color: 'from-brand-magenta to-brand-yellow', tag: 'Programación' },
  { label: 'Probando sensores en equipo', color: 'from-brand-cyan to-brand-magenta', tag: 'Experimentación' },
  { label: 'Presentando su invento final', color: 'from-brand-yellow to-brand-blue', tag: 'Creatividad' },
  { label: 'Descubriendo cómo funciona un robot', color: 'from-brand-blue to-brand-magenta', tag: 'Descubrimiento' },
]

export function ActivityCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (paused) return
    timer.current = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4500)
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [paused])

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length)
  const next = () => setIndex((i) => (i + 1) % slides.length)

  return (
    <section id="momentos" className="section relative overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, #FAFAF7 0%, #F0F7FF 100%)' }} />
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow" style={{ borderColor: 'rgba(232,62,153,0.25)', background: 'rgba(232,62,153,0.1)', color: '#E83E99' }}>Momentos</span>
          <h2 className="mt-4 font-display text-4xl font-bold text-brand-deep sm:text-5xl">
            Niños creando robots
          </h2>
          <p className="mt-4 text-brand-deep/70">
            Imágenes del taller se añadirán aquí. Por ahora, una vista previa de las actividades que vivirán los estudiantes.
          </p>
        </div>

        <div
          className="relative mx-auto mt-10 max-w-4xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative h-[320px] sm:h-[400px] overflow-hidden rounded-3xl shadow-soft">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className={`absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br ${slides[index].color} text-white`}
              >
                <Camera className="h-10 w-10 opacity-80" />
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest">{slides[index].tag}</span>
                <p className="max-w-md text-center text-xl font-bold">{slides[index].label}</p>
                <span className="text-sm opacity-70">Fotografía del taller (próximamente)</span>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-brand-deep shadow-soft transition hover:scale-110"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Siguiente"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-brand-deep shadow-soft transition hover:scale-110"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="mt-5 flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Ir a diapositiva ${i + 1}`}
                className={`h-2.5 rounded-full transition-all ${i === index ? 'w-8 bg-brand-blue' : 'w-2.5 bg-brand-deep/20'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
