import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Camera, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCms } from '@/cms/CmsContext'
import { GRADIENTS } from '@/cms/types'

export function ActivityCarousel() {
  const { data } = useCms()
  const { eyebrow, title, text, slides } = data.moments
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const slide = slides.length > 0 ? slides[index % slides.length] : null

  useEffect(() => {
    if (paused || slides.length < 2) return
    timer.current = setInterval(() => setIndex((current) => (current + 1) % slides.length), 4500)

    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [paused, slides.length])

  const prev = () => setIndex((current) => (current - 1 + slides.length) % slides.length)
  const next = () => setIndex((current) => (current + 1) % slides.length)

  return (
    <section id="momentos" className="section relative overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, #FAFAF7 0%, #F0F7FF 100%)' }} />
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span
            className="eyebrow"
            style={{ borderColor: 'rgba(232,62,153,0.25)', background: 'rgba(232,62,153,0.1)', color: '#E83E99' }}
          >
            {eyebrow}
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold text-brand-deep sm:text-5xl">{title}</h2>
          <p className="mt-4 text-brand-deep/70">{text}</p>
        </div>

        {slide && (
          <div
            className="relative mx-auto mt-10 max-w-4xl"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="relative h-[320px] overflow-hidden rounded-3xl shadow-soft sm:h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${index}-${slide.label}`}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className={`absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br ${GRADIENTS[slide.gradient]} text-white`}
                >
                  {slide.image ? (
                    <img src={slide.image} alt={slide.label} className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <Camera className="relative h-10 w-10 opacity-90" />
                  )}
                  {slide.image && <div className="absolute inset-0 bg-black/35" />}
                  <span className="relative rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
                    {slide.tag}
                  </span>
                  <p className="relative max-w-md px-12 text-center text-xl font-bold">{slide.label}</p>
                  {!slide.image && (
                    <span className="relative px-12 text-center text-sm opacity-90">
                      Fotografía del taller (próximamente)
                    </span>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {slides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Actividad anterior"
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-brand-deep shadow-soft transition hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Actividad siguiente"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-brand-deep shadow-soft transition hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="mt-5 flex justify-center gap-2">
                  {slides.map((item, slideIndex) => (
                    <button
                      type="button"
                      key={`${item.tag}-${slideIndex}`}
                      onClick={() => setIndex(slideIndex)}
                      aria-label={`Ir a actividad ${slideIndex + 1}`}
                      aria-current={slideIndex === index ? 'true' : undefined}
                      className={`h-2.5 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue ${
                        slideIndex === index ? 'w-8 bg-brand-blue' : 'w-2.5 bg-brand-deep/20'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
