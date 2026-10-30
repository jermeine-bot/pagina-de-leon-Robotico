import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useCms } from '@/cms/CmsContext'
import { Logo } from './Logo'

const links = [
  { href: '#aprender', label: 'Aprender' },
  { href: '#proceso', label: 'Proceso' },
  { href: '#galeria', label: 'Galería' },
  { href: '#proyectos', label: 'Proyectos' },
  { href: '#institucional', label: 'Institucional' },
  { href: '#faq', label: 'Preguntas' },
]

export function Navbar() {
  const { data } = useCms()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled ? 'bg-brand-warm/80 shadow-soft backdrop-blur' : 'bg-transparent'
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between">
        <a
          href="#hero"
          onDoubleClick={() => { window.location.hash = '#admin' }}
          className="flex items-center gap-2 font-display font-bold text-brand-deep cursor-pointer"
          title="Doble clic para administrar"
        >
          <Logo size={36} />
          <span className="hidden sm:inline">{data.programName}</span>
        </a>

        <ul className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-sm font-medium text-brand-deep/70 transition hover:text-brand-blue">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Solicitar información button removed per request */}

        <button
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menú"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <ul className="container-x flex flex-col gap-2 pb-4">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm font-medium text-brand-deep/80 hover:bg-brand-gray"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
              {/* Solicitar información button removed per request */}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
