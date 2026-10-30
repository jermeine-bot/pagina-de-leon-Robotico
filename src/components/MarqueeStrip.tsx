export function MarqueeStrip() {
  const items = ['LEGO Education', 'Sparki', 'Programación', 'Sensores', 'Robótica', 'Creatividad', 'STEM', 'Innovación', 'Trabajo en equipo', 'Algoritmos']
  const doubled = [...items, ...items]
  return (
    <div className="relative overflow-hidden border-y border-brand-deep/5 bg-brand-gray py-4">
      <div className="flex w-max animate-[marquee_30s_linear_infinite] gap-10">
        {doubled.map((t, i) => (
          <span key={i} className="flex items-center gap-3 whitespace-nowrap text-sm font-semibold uppercase tracking-widest text-brand-deep/60">
            <span className="h-2 w-2 rounded-full bg-brand-magenta" />
            {t}
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  )
}
