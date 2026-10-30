import { motion } from 'motion/react'
import { ArrowRight, Sparkles, Cpu, Blocks, Code2 } from 'lucide-react'
import { useCms } from '@/cms/CmsContext'
import { lazy, Suspense } from 'react'
const LegoRobot3D = lazy(() => import('./LegoRobot3D').then((m) => ({ default: m.LegoRobot3D })))

export function HeroSection({ onSceneReady }: { onSceneReady?: () => void }) {
  const { data } = useCms()
  const h = data.hero
  return (
    <section id="hero" className="relative overflow-hidden pt-24 sm:pt-28 pb-10">
      {/* playful background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #FAFAF7 0%, #F0F7FF 60%, #FAFAF7 100%)' }} />
        {/* grid of dots */}
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: 'radial-gradient(#2563EB 1.2px, transparent 1.2px)',
          backgroundSize: '28px 28px',
        }} />
        {/* color blobs */}
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-brand-cyan/20 blur-3xl animate-float" />
        <div className="absolute right-10 top-0 h-96 w-96 rounded-full bg-brand-magenta/15 blur-3xl" />
        <div className="absolute left-1/3 bottom-0 h-64 w-64 rounded-full bg-brand-yellow/25 blur-3xl" />
      </div>

      {/* floating bricks (decorative) */}
      <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
        <div className="absolute left-[8%] top-[18%] h-10 w-10 rounded-md bg-brand-yellow shadow-brick animate-float" style={{ animationDelay: '0.2s' }} />
        <div className="absolute left-[22%] top-[62%] h-7 w-7 rounded-md bg-brand-magenta shadow-brick animate-float" style={{ animationDelay: '1.1s' }} />
        <div className="absolute right-[6%] top-[12%] h-8 w-8 rounded-md bg-brand-cyan shadow-brick animate-float" style={{ animationDelay: '0.6s' }} />
        <div className="absolute right-[18%] bottom-[8%] h-12 w-12 rounded-md bg-brand-blue shadow-brick animate-float" style={{ animationDelay: '1.6s' }} />
      </div>

      <div className="container-x grid items-center gap-8 lg:grid-cols-2 lg:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative z-10"
        >
          <span className="eyebrow" style={{ borderColor: 'rgba(37,99,235,0.25)', background: 'rgba(55,200,232,0.12)', color: '#2563EB' }}>
            {h.eyebrow}
          </span>
          <h1 className="mt-5 font-display text-5xl font-extrabold leading-[0.98] tracking-tight text-brand-deep sm:text-6xl lg:text-7xl">
            El futuro{' '}
            <span className="relative inline-block text-brand-blue">
              se construye
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 14" fill="none">
                <path d="M2 9 Q50 2 100 9 T198 9" stroke="#FFD500" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>{' '}
            <span className="text-brand-magenta">jugando</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-deep/70">{h.subtitle}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#aprender"
              className="group inline-flex items-center gap-2 rounded-2xl bg-brand-blue px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-brand-blue/90"
            >
              {h.ctaPrimary}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
            <a
              href="#inscripcion"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-brand-deep/10 bg-white px-6 py-3.5 text-sm font-semibold text-brand-deep transition hover:border-brand-magenta hover:text-brand-magenta"
            >
              {h.ctaSecondary}
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-brand-deep/60">
            <span className="flex items-center gap-2 rounded-full bg-brand-yellow/20 px-3 py-1.5 font-medium text-brand-deep">
              <Sparkles className="h-4 w-4 text-brand-magenta" />
              {h.badge}
            </span>
            <span className="flex items-center gap-1.5"><Blocks className="h-4 w-4 text-brand-cyan" /> Construir</span>
            <span className="flex items-center gap-1.5"><Code2 className="h-4 w-4 text-brand-cyan" /> Programar</span>
            <span className="flex items-center gap-1.5"><Cpu className="h-4 w-4 text-brand-cyan" /> Experimentar</span>
          </div>
        </motion.div>

        <div className="relative h-[380px] sm:h-[460px] lg:h-[560px] rounded-3xl overflow-hidden">
          {data.heroImage && (
            <img src={data.heroImage} alt="Hero" className="absolute inset-0 h-full w-full object-cover opacity-30" />
          )}
          <Suspense fallback={<div className="flex h-full items-center justify-center text-brand-deep/40">Cargando modelo 3D…</div>}>
            <LegoRobot3D onReady={onSceneReady} />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
