import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Detailed LEGO SPIKE-style robot model (adapted from lego-robot-v2.html).
export function LegoRobot3D({ onReady }: { onReady?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const cv = document.createElement('canvas')
    container.appendChild(cv)

    const R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true })
    R.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    R.shadowMap.enabled = true
    R.shadowMap.type = THREE.PCFSoftShadowMap
    R.outputColorSpace = THREE.SRGBColorSpace

    const sc = new THREE.Scene()

    // Environment for reflections
    ;(function () {
      const es = new THREE.Scene()
      es.background = new THREE.Color(0x7d8791)
      ;[
        [0, 20, 0, 30, 1, 30],
        [25, 8, 0, 1, 14, 20],
        [-25, 8, 5, 1, 14, 20],
        [0, 8, 25, 24, 12, 1],
      ].forEach((a) => {
        const m = new THREE.Mesh(
          new THREE.BoxGeometry(a[3], a[4], a[5]),
          new THREE.MeshBasicMaterial({ color: 0xffffff }),
        )
        m.position.set(a[0], a[1], a[2])
        es.add(m)
      })
      sc.environment = new THREE.PMREMGenerator(R).fromScene(es, 0.04).texture
    })()

    const cam = new THREE.PerspectiveCamera(35, 1, 0.1, 200)
    cam.position.set(2, 7, 24)

    const oc = new OrbitControls(cam, cv)
    oc.target.set(0.8, 6, 0)
    oc.enableDamping = true
    oc.autoRotate = !reducedMotion
    oc.autoRotateSpeed = 1.1
    oc.addEventListener('start', () => {
      oc.autoRotate = false
    })

    sc.add(new THREE.HemisphereLight(0xffffff, 0x99a3ad, 0.5))
    const dl = new THREE.DirectionalLight(0xffffff, 0.8)
    dl.position.set(8, 18, 14)
    dl.castShadow = true
    dl.shadow.bias = -0.0004
    dl.shadow.mapSize.set(2048, 2048)
    Object.assign(dl.shadow.camera, { left: -12, right: 12, top: 16, bottom: -6, near: 1, far: 60 })
    sc.add(dl)

    const C = { pink: 0xe6007e, teal: 0x2dc0e4, yel: 0xffc61a, blue: 0x1d44b5, white: 0xf6f6f6, black: 0x1c1d20, grey: 0xaeb1b6, dark: 0x0d0f12 }
    const lin = (c: number) => new THREE.Color(c).convertSRGBToLinear()
    const mat = (c: number) =>
      new THREE.MeshPhysicalMaterial({ color: lin(c), roughness: 0.45, clearcoat: 0.2, clearcoatRoughness: 0.4, envMapIntensity: 0.15 })
    const W = new THREE.Group()
    sc.add(W)
    const put = (m: THREE.Mesh, x: number, y: number, z: number, p?: THREE.Group) => {
      m.position.set(x, y, z)
      m.castShadow = m.receiveShadow = true
      ;(p || W).add(m)
      return m
    }
    function rshape(w: number, h: number, r: number) {
      const s = new THREE.Shape()
      const x = -w / 2
      const y = -h / 2
      r = Math.min(r, w / 2, h / 2)
      s.moveTo(x + r, y)
      s.lineTo(x + w - r, y)
      s.quadraticCurveTo(x + w, y, x + w, y + r)
      s.lineTo(x + w, y + h - r)
      s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
      s.lineTo(x + r, y + h)
      s.quadraticCurveTo(x, y + h, x, y + h - r)
      s.lineTo(x, y + r)
      s.quadraticCurveTo(x, y, x + r, y)
      return s
    }
    function ext(s: THREE.Shape, d: number, b = 0.04) {
      const g = new THREE.ExtrudeGeometry(s, { depth: d - 2 * b, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 2, curveSegments: 14 })
      g.translate(0, 0, -(d - 2 * b) / 2)
      return g
    }
    const rb = (w: number, h: number, d: number, c: number, x: number, y: number, z: number, p: any, r = 0.12) =>
      put(new THREE.Mesh(ext(rshape(w - 0.08, h - 0.08, r || 0.1), d), mat(c)), x, y, z, p)
    function cyl(r: number, h: number, c: number, x: number, y: number, z: number, p: any, az = false) {
      const m = put(new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 28), typeof c === 'number' ? mat(c) : (c as any)), x, y, z, p)
      if (az) m.rotation.x = Math.PI / 2
      return m
    }
    const dk = new THREE.MeshBasicMaterial({ color: C.dark })
    function hole(x: number, y: number, z: number, p: any, r = 0.14) {
      const m = new THREE.Mesh(new THREE.CircleGeometry(r, 20), dk)
      m.position.set(x, y, z)
      ;(p || W).add(m)
    }
    function plus(x: number, y: number, z: number, p: any, s: number) {
      ;[0, 1].forEach((i) => {
        const m = new THREE.Mesh(new THREE.BoxGeometry(s, s * 0.34, 0.03), dk)
        m.rotation.z = i * (Math.PI / 2)
        m.position.set(x, y, z)
        ;(p || W).add(m)
      })
    }
    function studs(w: number, h: number, d: number, c: number, n: number, k: number, p: any) {
      for (let i = 0; i < n; i++)
        for (let j = 0; j < k; j++) cyl(0.2, 0.14, c, -w / 2 + (w / n) * (i + 0.5), h / 2 + 0.07, -d / 2 + (d / k) * (j + 0.5), p)
    }
    function brick(w: number, h: number, d: number, c: number, x: number, y: number, z: number, rz: number, n: number, k: number, np: number, p: any) {
      const g = new THREE.Group()
      g.position.set(x, y, z)
      g.rotation.z = rz || 0
      ;(p || W).add(g)
      rb(w, h, d, c, 0, 0, 0, g, 0.12)
      studs(w, h, d, c, n, k, g)
      for (let i = 0; i < np; i++) plus(-w / 2 + (w / np) * (i + 0.5), 0, d / 2 + 0.02, g, 0.34)
      return g
    }
    function beam(a: number[], b: number[], t: number, c: number, z: number, d: number, p: any) {
      const dx = b[0] - a[0]
      const dy = b[1] - a[1]
      const L = Math.hypot(dx, dy)
      const n = Math.max(1, Math.round(L / 0.8))
      const s = rshape(L + t, t, t / 2)
      for (let i = 0; i <= n; i++) {
        const h = new THREE.Path()
        h.absarc(-L / 2 + (L / n) * i, 0, t * 0.3, 0, Math.PI * 2, true)
        s.holes.push(h)
      }
      const m = put(new THREE.Mesh(ext(s, d, 0.03), mat(c)), (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, z, p)
      m.rotation.z = Math.atan2(dy, dx)
      return m
    }
    function pivot(px: number, py: number) {
      const o = new THREE.Group()
      o.position.set(px, py, 0)
      const i = new THREE.Group()
      i.position.set(-px, -py, 0)
      o.add(i)
      W.add(o)
      return [o, i]
    }

    // ---- Hub base
    rb(4.7, 0.95, 2.8, C.yel, 0.4, 1.2, 0, W, 0.15)
    rb(4.7, 0.6, 2.8, C.white, 0.4, 1.95, 0, W, 0.15)
    for (let i = 0; i < 5; i++)
      for (let j = 0; j < 5; j++) {
        const on = (i + j) % 3 === 0
        const m = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.05, 0.32), new THREE.MeshStandardMaterial({ color: lin(on ? 0xffb347 : 0xf0e6d6), emissive: on ? 0x5a3a08 : 0 }))
        m.position.set(-0.5 + i * 0.42, 2.27, -0.8 + j * 0.42)
        W.add(m)
      }
    for (let i = 0; i < 3; i++) rb(0.7, 0.3, 0.1, C.dark, -0.5 + i * 1.1, 1.95, 1.4, W, 0.04)
    cyl(0.3, 0.08, C.grey, 1.9, 2.28, 0.9, W)
    cyl(0.22, 0.1, C.white, 1.9, 2.28, 0.9, W)
    rb(1, 0.25, 0.08, 0xe6b800, 0.4, 1.1, 1.42, W, 0.08)
    // ---- Motor lateral derecho
    rb(1.6, 1.5, 1.6, C.white, 2.9, 3, 0, W, 0.14)
    rb(2.4, 1.05, 1.25, C.teal, 4.75, 3, 0, W, 0.12)
    rb(0.9, 0.14, 0.9, C.teal, 4.9, 3.55, 0, W, 0.05)
    cyl(0.72, 0.4, C.teal, 2.35, 3, 0.95, W, true)
    cyl(0.22, 0.45, C.white, 2.35, 3, 1, W, true)
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3
      hole(2.35 + Math.cos(a) * 0.45, 3 + Math.sin(a) * 0.45, 1.17, W, 0.07)
    }
    beam([2.35, 3], [1.25, 4.5], 0.2, C.black, 1.1, 0.18, W)
    // ---- Piernas
    beam([-0.55, 6.4], [-1.55, 1.55], 0.58, C.teal, 0.95, 0.5, W)
    beam([1.25, 6.4], [1.7, 0.95], 0.58, C.teal, 0.95, 0.5, W)
    beam([-0.55, 6.4], [-1.55, 1.55], 0.58, C.teal, -0.95, 0.5, W)
    beam([1.25, 6.4], [1.7, 0.95], 0.58, C.teal, -0.95, 0.5, W)
    brick(1.9, 0.85, 1.3, C.blue, -2.3, 1.2, 0.9, -0.12, 3, 2, 3, W)
    brick(1.9, 0.85, 1.3, C.blue, 1.9, 0.9, 0.9, 0.28, 3, 2, 3, W)
    // ---- Cadera y torso
    rb(2.2, 1.0, 1.5, C.white, 0.35, 6.5, 0, W, 0.14)
    rb(2.2, 0.4, 1.5, C.black, 0.35, 7.05, 0, W, 0.1)
    for (let i = 0; i < 4; i++) hole(-0.35 + i * 0.5, 7.05, 0.76, W, 0.14)
    rb(1.7, 2.1, 1.45, C.teal, 0.15, 8.05, 0, W, 0.14)
    for (let i = 0; i < 2; i++) hole(-0.15 + i * 0.6, 7.2, 0.74, W, 0.13)
    rb(1.75, 1.9, 1.45, C.white, 0.15, 9.95, 0, W, 0.14)
    for (let i = 0; i < 3; i++) hole(-0.35 + i * 0.5, 10.6, 0.74, W, 0.1)
    cyl(0.58, 0.4, C.grey, -1, 10.15, 0.8, W, true)
    cyl(0.42, 0.45, 0x9a9ea5, -1, 10.15, 0.82, W, true)
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2
      cyl(0.06, 0.42, 0x8a8e95, -1 + Math.cos(a) * 0.58, 10.15 + Math.sin(a) * 0.58, 0.8, W, true)
    }
    cyl(0.52, 0.4, C.teal, 0.95, 10.55, 0.8, W, true)
    cyl(0.17, 0.45, C.white, 0.95, 10.55, 0.82, W, true)
    // ---- Brazos (con balanceo)
    const [aL, iL] = pivot(-1.4, 9.8) as any
    const [aR, iR] = pivot(1.4, 10.3) as any
    rb(1.3, 1.35, 1.35, C.pink, -1.85, 9.8, 0, iL, 0.12)
    rb(1.4, 1.35, 1.35, C.pink, 1.75, 10.4, 0, iR, 0.12)
    ;[[-2.2, 9.45], [-1.5, 9.45], [-2.2, 10.15], [-1.5, 10.15]].forEach((p) => {
      hole(p[0], p[1], 0.69, iL, 0.13)
      hole(p[0], p[1], -0.69, iL, 0.13)
    })
    ;[[1.4, 10.05], [2.1, 10.05], [1.4, 10.75], [2.1, 10.75]].forEach((p) => {
      hole(p[0], p[1], 0.69, iR, 0.13)
      hole(p[0], p[1], -0.69, iR, 0.13)
    })
    beam([-2.4, 9.5], [-3.45, 10.4], 0.32, C.black, 0, 0.4, iL)
    beam([2.5, 10.6], [3.75, 9.9], 0.32, C.black, 0, 0.4, iR)
    brick(2.4, 1.05, 1.05, C.yel, -3.8, 10.85, 0, -0.55, 4, 2, 3, iL)
    brick(2.4, 1.05, 1.05, C.yel, 4.25, 9.3, 0, -0.6, 4, 2, 3, iR)
    // ---- Cabeza
    rb(0.3, 0.55, 0.3, C.black, -0.1, 10.95, 0, W, 0.05)
    rb(1.4, 1.4, 1.4, C.white, -0.15, 11.85, 0, W, 0.16)
    const lens = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.09, 16, 48), mat(C.grey))
    put(lens, -0.15, 11.85, 0.72)
    cyl(0.35, 0.08, C.dark, -0.15, 11.85, 0.7, W, true)
    cyl(0.15, 0.1, 0x3d434d, -0.15, 11.85, 0.73, W, true)
    // ---- Cables planos
    function ribbon(pts: number[][], w: number) {
      const cu = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)))
      const N = 140
      const pos: number[] = []
      const idx: number[] = []
      const zv = new THREE.Vector3(0, 0, 1)
      for (let i = 0; i <= N; i++) {
        const t = i / N
        const p = cu.getPoint(t)
        const tg = cu.getTangent(t)
        const s = new THREE.Vector3().crossVectors(tg, zv).normalize().multiplyScalar(w / 2)
        pos.push(p.x + s.x, p.y + s.y, p.z, p.x - s.x, p.y - s.y, p.z)
        if (i < N) {
          const k = i * 2
          idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2)
        }
      }
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
      g.setIndex(idx)
      g.computeVertexNormals()
      const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: lin(0xe9ebee), roughness: 0.5, side: THREE.DoubleSide }))
      m.castShadow = true
      W.add(m)
    }
    ribbon([[0.5, 11.6, -0.55], [2.4, 12.4, -0.7], [3.6, 11, -1], [3.8, 7.2, -1.3], [3.3, 4.8, -1.2], [1.8, 4.1, -0.9], [0.9, 3.1, -0.6], [0.9, 2.35, -0.3]], 0.34)
    ribbon([[5.9, 3.1, 0], [6.8, 3.2, 0.3], [6.9, 2.2, 0.5], [5.9, 1.9, 0.7]], 0.4)
    // ---- Marcas de baile
    const MB = new THREE.MeshBasicMaterial({ color: 0x111111 })
    const BB = new THREE.Group()
    BB.position.set(0.8, 6, 0)
    sc.add(BB)
    const marks: THREE.Mesh[] = []
    ;[[-6.2, 4.5, 0.3], [-6, 3.7, 0.45], [-4.7, 2.8, 1], [4, 4.5, 1.6], [4.5, 4.2, -1], [5, 3.6, 0.85]].forEach((p) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.13, 0.1), MB)
      m.position.set(p[0], p[1], 0)
      m.rotation.z = p[2]
      BB.add(m)
      marks.push(m)
    })
    // ---- Piezas extra
    const GOLD = 0xc9a063
    cyl(0.16, 0.1, GOLD, -1.85, 9.8, 0.72, iL, true)
    cyl(0.16, 0.1, GOLD, 1.75, 10.4, 0.72, iR, true)
    cyl(0.15, 0.16, GOLD, 1.17, 5, 1.25, W, true)
    cyl(0.15, 0.2, C.black, -0.75, 6.1, 1.25, W, true)
    cyl(0.15, 0.2, C.black, 0.97, 6.3, 1.25, W, true)
    beam([3, 0.9], [3, 2.7], 0.45, C.black, 0.1, 0.5, W)
    ;[[2.35, 3], [1.25, 4.5]].forEach((p) => put(new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 12), mat(C.black)), p[0], p[1], 1.15))
    rb(0.6, 0.6, 0.06, 0x28a8cc, 4.75, 3, 0.65, W, 0.05)
    rb(0.3, 0.12, 0.06, 0x9aa0a6, -0.2, 10.6, 0.75, W, 0.04)
    rb(0.3, 0.12, 0.06, 0x9aa0a6, 0.5, 10.4, 0.75, W, 0.04)
    const seg = (a: number[], b: number[], w: number) => {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const m = new THREE.Mesh(new THREE.BoxGeometry(L, w, 0.1), MB)
      m.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0)
      m.rotation.z = Math.atan2(b[1] - a[1], b[0] - a[0])
      BB.add(m)
    }
    const dot = (x: number, y: number, r: number) => {
      const m = new THREE.Mesh(new THREE.CircleGeometry(r, 20), MB)
      m.position.set(x, y, 0)
      BB.add(m)
    }
    function note(x: number, y: number) {
      dot(x, y, 0.2)
      dot(x + 0.85, y - 0.12, 0.2)
      seg([x + 0.17, y], [x + 0.17, y + 1], 0.1)
      seg([x + 1.02, y - 0.12], [x + 1.02, y + 0.88], 0.1)
      seg([x + 0.12, y + 1], [x + 1.07, y + 0.9], 0.14)
    }
    note(-4.3, -2)
    note(-7.2, -2.9)
    seg([5.6, 5.6], [5.6, 4.6], 0.1)
    seg([5.6, 4.6], [6.5, 5.1], 0.1)
    seg([6.5, 5.1], [5.6, 5.6], 0.1)
    seg([7.1, 5.75], [7.7, 5.75], 0.12)
    seg([7.4, 5.45], [7.4, 6.05], 0.12)
    // ---- Suelo
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.22 }))
    fl.rotation.x = -Math.PI / 2
    fl.position.y = 0.74
    fl.receiveShadow = true
    sc.add(fl)

    function rs() {
      const w = (container && container.clientWidth) || 600
      const h = (container && container.clientHeight) || 560
      if (w < 10 || h < 10) return
      R.setSize(w, h, false)
      cam.aspect = w / h
      cam.position.setLength(w / h < 0.8 ? 38 : 27)
      cam.updateProjectionMatrix()
    }
    window.addEventListener('resize', rs)
    // Observe container size changes (lazy mount, responsive)
    let ro: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined' && container) {
      ro = new ResizeObserver(() => rs())
      ro.observe(container)
    }
    // Initial sizing after layout
    requestAnimationFrame(() => {
      requestAnimationFrame(() => rs())
    })

    const clk = new THREE.Clock()
    let raf = 0
    function loop() {
      const t = clk.getElapsedTime()
      aL.rotation.z = Math.sin(t * 3) * 0.12
      aR.rotation.z = Math.sin(t * 3 + 1.5) * 0.12
      marks.forEach((m, i) => {
        const s = 0.6 + 0.4 * Math.abs(Math.sin(t * 3 + i))
        m.scale.set(s, 1, 1)
      })
      oc.update()
      BB.quaternion.copy(cam.quaternion)
      R.render(sc, cam)
      raf = requestAnimationFrame(loop)
    }
    loop()

    if (onReady) onReady()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', rs)
      if (ro) ro.disconnect()
      oc.dispose()
      R.dispose()
      if (cv.parentNode) cv.parentNode.removeChild(cv)
    }
  }, [onReady])

  return <div ref={containerRef} className="h-full w-full" />
}
