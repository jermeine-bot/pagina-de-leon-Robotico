import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowUp } from 'lucide-react'

export function FloatingCTA() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href="#inscripcion"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-2xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5"
        >
          Inscribirme <ArrowUp className="h-4 w-4 rotate-90" />
        </motion.a>
      )}
    </AnimatePresence>
  )
}
