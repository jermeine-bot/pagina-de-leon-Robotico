import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Megaphone, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCms } from '@/cms/CmsContext'

const DISMISS_KEY = 'announcement_dismissed'

export function Announcement() {
  const { data } = useCms()
  const items = (data.announcements || []).filter((a) => a.enabled)
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (items.length === 0) return
    if (sessionStorage.getItem(DISMISS_KEY) === '1') return
    const t = setTimeout(() => setVisible(true), 2000)
    return () => clearTimeout(t)
  }, [items.length])

  const dismissAll = () => {
    setVisible(false)
    sessionStorage.setItem(DISMISS_KEY, '1')
  }

  const next = () => setIndex((i) => (i + 1) % items.length)
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length)

  if (items.length === 0) return null
  const a = items[index % items.length]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-deep/60 p-4 backdrop-blur-sm"
          onClick={dismissAll}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <button
              onClick={dismissAll}
              aria-label="Cerrar anuncio"
              className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-1.5 text-brand-deep/60 shadow hover:text-brand-deep"
            >
              <X className="h-4 w-4" />
            </button>

            {a.image && (
              <div className="h-40 overflow-hidden">
                <img src={a.image} alt={a.title} className="h-full w-full object-cover" />
              </div>
            )}

            <div className="p-6">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-yellow text-brand-deep shadow-brick">
                  <Megaphone className="h-5 w-5" />
                </span>
                <h3 className="font-display text-xl font-bold text-brand-deep">{a.title}</h3>
              </div>
              <p className="mt-3 text-sm text-brand-deep/70">{a.text}</p>
              {a.cta && a.link && (
                <a
                  href={a.link}
                  onClick={dismissAll}
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5"
                >
                  {a.cta}
                </a>
              )}

              {items.length > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <button onClick={prev} className="rounded-full bg-brand-gray p-1.5 text-brand-deep/60 hover:text-brand-blue" aria-label="Anterior">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-xs text-brand-deep/50">{index + 1} / {items.length}</span>
                  <button onClick={next} className="rounded-full bg-brand-gray p-1.5 text-brand-deep/60 hover:text-brand-blue" aria-label="Siguiente">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
