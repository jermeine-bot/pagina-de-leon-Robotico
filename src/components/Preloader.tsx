import { useEffect, useRef } from 'react'

const CSS = `
:root{--bg:#f3f6fa;--fg:#1d2733;--pink:#e6007e;--teal:#2dc0e4;--yel:#ffc61a;--blue:#1d44b5;--wh:#f6f6f6;--bk:#1c1d20;--line:#c4cdd8}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#171c23;--fg:#e8eef5;--blue:#4a78ff;--line:#3a4552}}
*{box-sizing:border-box}
.preloader-root{position:fixed;inset:0;z-index:99;background:var(--bg);color:var(--fg);font-family:system-ui,"Segoe UI",Arial,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;overflow:hidden;transition:opacity .7s ease,visibility .7s;padding:env(safe-area-inset-top,0px) 0 env(safe-area-inset-bottom,0px)}
.preloader-root.out{opacity:0;visibility:hidden}
.preloader-root .hello{margin:0;text-align:center;min-height:clamp(110px,22vw,150px);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 12px}
.preloader-root .hello small{font-size:clamp(16px,4vw,24px);letter-spacing:6px;text-transform:uppercase;opacity:0;transform:translateY(10px);transition:all .5s}
.preloader-root.hi .hello small{opacity:.7;transform:none}
.preloader-root .big{font-size:clamp(36px,10vw,76px);font-weight:900;line-height:1.05}
.preloader-root .ch{display:inline-block;opacity:0;transform:translateY(34px) scale(.4)}
.preloader-root.hi .ch{animation:pop .55s cubic-bezier(.3,1.6,.5,1) calc(var(--i)*60ms) forwards,flt 1.8s ease-in-out calc(var(--i)*90ms + 1.2s) infinite}
@keyframes pop{to{opacity:1;transform:none}}
.preloader-root .scene{position:relative;width:100%;height:250px;overflow:hidden}
.preloader-root .ground{position:absolute;left:0;right:0;bottom:44px;height:4px;background:var(--line)}
.preloader-root .ticks{position:absolute;left:0;right:0;bottom:30px;height:6px;background:repeating-linear-gradient(90deg,var(--line) 0 24px,transparent 24px 56px);animation:slide .5s linear infinite}
@keyframes slide{to{background-position-x:-56px}}
.preloader-root .prop{position:absolute;left:100%;bottom:48px;width:var(--w);height:26px;background:var(--c);border-radius:4px;animation:fly 14.3s linear infinite var(--dl)}
.preloader-root .prop::before{content:"";position:absolute;left:4px;right:4px;top:-6px;height:7px;background:radial-gradient(circle at 50% 70%,var(--c) 0 3.6px,transparent 4.2px) 0 0/16px 7px}
@keyframes fly{to{transform:translateX(-1600px)}}
.preloader-root.stop .ticks,.preloader-root.stop .prop{animation-play-state:paused}
.preloader-root .actor{position:absolute;left:50%;bottom:32px;width:120px;margin-left:-60px;animation:enter 1.1s ease-out both}
@keyframes enter{from{transform:translateX(-70vw)}to{transform:none}}
.preloader-root .actor svg{width:100%;display:block;overflow:visible}
.preloader-root .body{animation:bob .35s ease-in-out infinite alternate}
@keyframes bob{to{transform:translateY(-4px)}}
.preloader-root .leg,.preloader-root .arm{transform-box:fill-box;transform-origin:50% 0;animation:sw .7s ease-in-out infinite alternate}
.preloader-root .leg.l,.preloader-root .arm.r{transform:rotate(-24deg);animation-name:swa}
.preloader-root .leg.r,.preloader-root .arm.l{animation-name:swb}
@keyframes swa{from{transform:rotate(-24deg)}to{transform:rotate(24deg)}}
@keyframes swb{from{transform:rotate(24deg)}to{transform:rotate(-24deg)}}
.preloader-root.hi .body,.preloader-root.hi .leg,.preloader-root.hi .arm.l{animation:none;transform:none}
.preloader-root.hi .arm.r{animation:wave .45s ease-in-out infinite alternate;transform:rotate(150deg)}
@keyframes wave{from{transform:rotate(135deg)}to{transform:rotate(175deg)}}
.preloader-root .eye{transform-box:fill-box;transform-origin:center;animation:blink 2.4s infinite 1s}
@keyframes blink{0%,92%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
.preloader-root::before{content:"";position:absolute;z-index:-1;left:50%;top:32%;width:70vmin;height:70vmin;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(255,198,26,.2),transparent 65%);animation:glow 2.4s ease-in-out infinite alternate}
@keyframes glow{to{transform:translate(-50%,-50%) scale(1.18)}}
.preloader-root .gear{position:absolute;font-size:42px;opacity:.1;animation:spin 9s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.preloader-root.stop .gear{animation-play-state:paused}
.preloader-root .mane{transform-box:fill-box;transform-origin:center;animation:mn .7s ease-in-out infinite alternate}
@keyframes mn{to{transform:scale(1.06)}}
.preloader-root .sh{transform-box:fill-box;transform-origin:center;animation:shp .35s ease-in-out infinite alternate}
@keyframes shp{to{transform:scale(.82)}}
.preloader-root.hi .sh,.preloader-root.hi .mane{animation:none}
.preloader-root.hi .eye{fill:var(--teal)}
@keyframes flt{50%{transform:translateY(-9px)}}
.preloader-root .conf{position:absolute;left:50%;top:34%;width:var(--w);height:calc(var(--w)*.6);background:var(--c);border-radius:2px;pointer-events:none;animation:burst 1.7s cubic-bezier(.2,.8,.3,1) forwards}
@keyframes burst{0%{transform:translate(0,0) rotate(0);opacity:1}100%{transform:translate(var(--x),calc(var(--y) + 140px)) rotate(var(--r));opacity:0}}
.preloader-root #pct{font-size:20px;font-weight:800;font-variant-numeric:tabular-nums}
.preloader-root .bar{width:min(78vw,340px);height:20px;border-radius:12px;background:var(--line);overflow:hidden;position:relative}
.preloader-root .fill{height:100%;width:0;background:linear-gradient(90deg,var(--pink),var(--yel))}
.preloader-root .bar::after{content:"";position:absolute;inset:0;background:radial-gradient(circle,rgba(255,255,255,.55) 0 3.5px,transparent 4.5px) 0 0/34px 20px}
@media (prefers-reduced-motion:reduce){.preloader-root .ticks,.preloader-root .prop,.preloader-root .body,.preloader-root .leg,.preloader-root .arm,.preloader-root .eye,.preloader-root .actor{animation:none}.preloader-root.hi .ch{animation-duration:.01s}}
`

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const bigRef = useRef<HTMLSpanElement>(null)
  const msgRef = useRef<HTMLDivElement>(null)
  const pctRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const L = rootRef.current
    if (!L) return
    const DUR = 3800
    const cols = ['var(--pink)', 'var(--teal)', 'var(--yel)', 'var(--blue)']

    function letters(el: HTMLElement, text: string) {
      el.innerHTML = ''
      Array.from(text).forEach((c, i) => {
        const s = document.createElement('span')
        s.className = 'ch'
        s.style.setProperty('--i', String(i))
        s.style.color = cols[i % 4]
        s.textContent = c === ' ' ? '\u00a0' : c
        el.appendChild(s)
      })
    }

    function confetti(el: HTMLElement) {
      const c = ['#e6007e', '#2dc0e4', '#ffc61a', '#1d44b5']
      for (let i = 0; i < 46; i++) {
        const d = document.createElement('i')
        const a = Math.random() * Math.PI * 2
        const r = 120 + Math.random() * 220
        d.className = 'conf'
        d.style.setProperty('--x', Math.cos(a) * r + 'px')
        d.style.setProperty('--y', Math.sin(a) * r * 0.7 - 60 + 'px')
        d.style.setProperty('--r', Math.random() * 720 - 360 + 'deg')
        d.style.setProperty('--c', c[i % 4])
        d.style.setProperty('--w', 8 + Math.random() * 10 + 'px')
        el.appendChild(d)
      }
    }

    const big = bigRef.current
    const msg = msgRef.current
    const pct = pctRef.current
    const fill = fillRef.current
    if (!big || !msg || !pct || !fill) return

    letters(big, 'León Robótico')

    let raf = 0
    const t0 = performance.now()
    function tick(now: number) {
      const k = Math.min((now - t0) / DUR, 1)
      const v = Math.round(k * 100)
      pct!.textContent = v + '%'
      fill!.style.width = v + '%'
      msg!.textContent = v >= 100 ? '¡Listo!' : ['Preparando motores…', 'Calibrando sensores…', 'Despertando al león…', 'Casi listo…'][Math.floor(v / 25)]
      if (k < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        L!.classList.add('stop', 'hi')
        confetti(L!)
        setTimeout(() => {
          L!.classList.add('out')
          setTimeout(() => onComplete(), 700)
        }, 2600)
      }
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
    }
  }, [onComplete])

  return (
    <>
      <style>{CSS}</style>
      <div ref={rootRef} className="preloader-root" role="status" aria-live="polite">
        <h1 className="hello">
          <small>Bienvenido a</small>
          <span className="big" ref={bigRef} aria-label="León Robótico"></span>
        </h1>
        <div className="scene">
          <span className="gear" style={{ left: '8%', top: '18px' }}>⚙</span>
          <span className="gear" style={{ right: '10%', top: '60px', fontSize: '60px' }}>⚙</span>
          <span className="gear" style={{ left: '30%', top: '110px', fontSize: '28px' }}>⚙</span>
          <i className="prop" style={{ ['--c' as any]: 'var(--pink)', ['--w' as any]: '46px', ['--dl' as any]: '0s' }}></i>
          <i className="prop" style={{ ['--c' as any]: 'var(--teal)', ['--w' as any]: '70px', ['--dl' as any]: '-3s' }}></i>
          <i className="prop" style={{ ['--c' as any]: 'var(--yel)', ['--w' as any]: '46px', ['--dl' as any]: '-6s' }}></i>
          <i className="prop" style={{ ['--c' as any]: 'var(--blue)', ['--w' as any]: '58px', ['--dl' as any]: '-9s' }}></i>
          <i className="prop" style={{ ['--c' as any]: 'var(--pink)', ['--w' as any]: '70px', ['--dl' as any]: '-12s' }}></i>
          <div className="ground"></div>
          <div className="ticks"></div>
          <div className="actor">
            <svg viewBox="0 0 120 200" aria-hidden="true">
              <ellipse className="sh" cx="60" cy="190" rx="34" ry="5" fill="#000" opacity=".18" />
              <g className="leg l"><rect x="40" y="122" width="14" height="52" rx="5" fill="var(--teal)" /><g fill="#0d0f12"><circle cx="47" cy="134" r="2" /><circle cx="47" cy="146" r="2" /><circle cx="47" cy="158" r="2" /></g><rect x="34" y="172" width="26" height="14" rx="3" fill="var(--blue)" /><g fill="var(--blue)" stroke="#0f2a78"><circle cx="41" cy="170" r="3" /><circle cx="53" cy="170" r="3" /></g></g>
              <g className="leg r"><rect x="66" y="122" width="14" height="52" rx="5" fill="var(--teal)" /><g fill="#0d0f12"><circle cx="73" cy="134" r="2" /><circle cx="73" cy="146" r="2" /><circle cx="73" cy="158" r="2" /></g><rect x="60" y="172" width="26" height="14" rx="3" fill="var(--blue)" /><g fill="var(--blue)" stroke="#0f2a78"><circle cx="67" cy="170" r="3" /><circle cx="79" cy="170" r="3" /></g></g>
              <g className="body">
                <rect x="38" y="112" width="44" height="16" rx="4" fill="var(--wh)" stroke="var(--line)" /><rect x="38" y="112" width="44" height="7" rx="3" fill="var(--bk)" />
                <rect x="46" y="76" width="28" height="38" rx="4" fill="var(--teal)" /><g fill="#0d0f12"><circle cx="54" cy="108" r="2" /><circle cx="66" cy="108" r="2" /></g>
                <rect x="44" y="46" width="32" height="32" rx="4" fill="var(--wh)" stroke="var(--line)" /><circle cx="41" cy="60" r="7" fill="#aeb1b6" /><circle cx="79" cy="56" r="6" fill="var(--teal)" />
                <g className="arm l"><rect x="22" y="48" width="22" height="22" rx="3" fill="var(--pink)" /><circle cx="33" cy="59" r="3" fill="#c9a063" /><rect x="29" y="68" width="8" height="26" rx="3" fill="var(--bk)" /><rect x="24" y="92" width="18" height="24" rx="3" fill="var(--yel)" /><g fill="var(--yel)" stroke="#c99600"><circle cx="29" cy="117" r="2.6" /><circle cx="37" cy="117" r="2.6" /></g></g>
                <g className="arm r"><rect x="76" y="48" width="22" height="22" rx="3" fill="var(--pink)" /><circle cx="87" cy="59" r="3" fill="#c9a063" /><rect x="83" y="68" width="8" height="26" rx="3" fill="var(--bk)" /><rect x="78" y="92" width="18" height="24" rx="3" fill="var(--yel)" /><g fill="var(--yel)" stroke="#c99600"><circle cx="83" cy="117" r="2.6" /><circle cx="91" cy="117" r="2.6" /></g></g>
                <rect x="55" y="40" width="10" height="8" fill="var(--bk)" />
                <rect x="42" y="6" width="36" height="36" rx="5" fill="var(--wh)" stroke="var(--line)" /><circle cx="60" cy="24" r="12" fill="#aeb1b6" /><circle className="eye" cx="60" cy="24" r="8" fill="#0d0f12" /><circle cx="63" cy="21" r="2.2" fill="#fff" />
              </g>
            </svg>
          </div>
        </div>
        <div ref={pctRef} id="pct">0%</div>
        <div ref={msgRef} id="msg" style={{ fontSize: '13px', opacity: 0.7, minHeight: '1.2em' }}>Preparando motores…</div>
        <div className="bar" aria-hidden="true"><div className="fill" ref={fillRef}></div></div>
      </div>
    </>
  )
}
