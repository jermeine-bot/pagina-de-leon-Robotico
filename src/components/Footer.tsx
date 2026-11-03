import { useCms } from '@/cms/CmsContext'
import { Facebook, Instagram, Youtube, Sparkles, MapPin, Phone } from 'lucide-react'
import { Logo } from './Logo'

export function Footer() {
  const { data } = useCms()
  return (
    <footer className="relative overflow-hidden bg-brand-deep text-white">
      {/* decorative top wave */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-blue via-brand-cyan via-brand-yellow to-brand-magenta" />

      <div className="container-x py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 cursor-pointer" onDoubleClick={() => { window.location.hash = '#admin' }}>
              <Logo size={44} />
              <div>
                <p className="font-display text-lg font-bold">{data.programName}</p>
                <p className="text-sm text-white/60">{data.tagline}</p>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm text-white/70">
              Un espacio donde las ideas cobran vida con LEGO y Sparki. Educación tecnológica para la niñez.
            </p>
            <div className="mt-5 flex gap-3">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Red social"
                  className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white/80 transition hover:-translate-y-0.5 hover:bg-brand-yellow hover:text-brand-deep"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-brand-yellow">Navegación</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {['#aprender', '#proceso', '#galeria', '#proyectos', '#institucional', '#faq', '#inscripcion'].map((h) => (
                <li key={h}>
                  <a href={h} className="transition hover:text-brand-cyan">
                    {h.replace('#', '').charAt(0).toUpperCase() + h.replace('#', '').slice(1)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-brand-yellow">Contacto</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-cyan shrink-0" />
                <a 
                  href="https://api.whatsapp.com/send?phone=50581073392" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="transition hover:text-brand-cyan"
                >
                  +505 81073392
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-brand-cyan shrink-0 mt-0.5" />
                <span>De donde fue Asados Pelibuey 1/2 cda. hacia abajo, León, Nicaragua</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-cyan shrink-0" /> 
                <span>Programa educativo Alcaldía de León</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {data.municipality || 'León'}. Todos los derechos reservados.</p>
          <p>Aviso de privacidad · Créditos institucionales</p>
        </div>
      </div>
    </footer>
  )
}