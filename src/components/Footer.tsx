import { useCms } from '@/cms/CmsContext'
import { Facebook, Instagram, Youtube, Sparkles, MapPin, Phone } from 'lucide-react'

export function Footer() {
  const { data } = useCms() as { data: any }
  
  const navLinks = ['#aprender', '#proceso', '#galeria', '#proyectos', '#institucional', '#faq', '#inscripcion']

  return (
    <footer className="relative overflow-hidden bg-brand-deep text-white">
      {/* Línea decorativa superior */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-blue via-brand-cyan via-brand-yellow to-brand-magenta" />

      <div className="container-x py-10 md:py-14">
        
        {/* ================= VISTA MÓVIL (block md:hidden) ================= */}
        <div className="flex flex-col gap-8 md:hidden">
          {/* Marca / Branding centralizado */}
          <div className="flex flex-col items-center text-center">
            <div 
              className="flex items-center justify-center cursor-pointer transition-transform active:scale-95" 
              onDoubleClick={() => { window.location.hash = '#admin' }}
            >
              <img 
                src="/Logo.jpg" 
                alt="Logo" 
                className="h-20 w-20 rounded-2xl object-cover shadow-md border border-white/10" 
              />
            </div>
            <h3 className="mt-3 font-display text-xl font-bold text-white">{data?.programName}</h3>
            <p className="text-xs text-brand-cyan font-medium mt-0.5">{data?.tagline}</p>
            <p className="mt-3 text-xs text-white/70 max-w-xs leading-relaxed">
              Un espacio donde las ideas cobran vida con LEGO y Sparki. Educación tecnológica para la niñez.
            </p>
          </div>

          {/* Redes sociales destacadas */}
          <div className="flex justify-center gap-3">
            {[
              { Icon: Facebook, href: '#', label: 'Facebook' },
              { Icon: Instagram, href: '#', label: 'Instagram' },
              { Icon: Youtube, href: '#', label: 'Youtube' }
            ].map(({ Icon, href, label }, i) => (
              <a
                key={i}
                href={href}
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white transition active:bg-brand-yellow active:text-brand-deep shadow-sm"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          {/* Tarjeta de Contacto Rápido */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-yellow text-center">Contacto directo</p>
            <div className="space-y-2.5 text-xs text-white/80">
              <a 
                href="https://api.whatsapp.com/send?phone=50581073392" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 rounded-xl bg-white/5 p-2.5 transition active:bg-white/10"
              >
                <Phone className="h-4 w-4 text-brand-cyan shrink-0" />
                <span className="font-medium">+505 81073392</span>
              </a>

              <div className="flex items-start gap-3 rounded-xl bg-white/5 p-2.5">
                <MapPin className="h-4 w-4 text-brand-cyan shrink-0 mt-0.5" />
                <span>De donde fue Asados Pelibuey 1/2 cda. abajo, León, Nicaragua</span>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-white/5 p-2.5">
                <Sparkles className="h-4 w-4 text-brand-cyan shrink-0" />
                <span>Programa educativo Alcaldía de León</span>
              </div>
            </div>
          </div>

          {/* Navegación en cuadrícula de 2 columnas */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-yellow text-center mb-3">Secciones</p>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              {navLinks.map((h) => (
                <a 
                  key={h} 
                  href={h} 
                  className="rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-white/80 transition active:bg-brand-cyan active:text-brand-deep font-medium"
                >
                  {h.replace('#', '').charAt(0).toUpperCase() + h.replace('#', '').slice(1)}
                </a>
              ))}
            </div>
          </div>
        </div>


        {/* ================= VISTA ESCRITORIO (hidden md:grid) ================= */}
        <div className="hidden md:grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div 
              className="flex items-center gap-3 cursor-pointer" 
              onDoubleClick={() => { window.location.hash = '#admin' }}
            >
              <img 
                src="/Logo.jpg" 
                alt="Logo" 
                className="h-20 w-20 rounded-xl object-cover border border-white/10" 
              />
              <div>
                <p className="font-display text-lg font-bold">{data?.programName}</p>
                <p className="text-sm text-white/60">{data?.tagline}</p>
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
              {navLinks.map((h) => (
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

        {/* Pie inferior con derechos y políticas */}
        <div className="mt-10 md:mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {data?.municipality || 'León'}. Todos los derechos reservados.</p>
          <p>Aviso de privacidad · Créditos institucionales</p>
        </div>
      </div>
    </footer>
  )
}