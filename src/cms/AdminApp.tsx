import { useState, useCallback } from 'react'
import { useCms } from './CmsContext'
import { Logo } from '@/components/Logo'
import {
  LayoutDashboard, Home, BookOpen, Route, Image as ImageIcon, FolderKanban, Bot, Building2,
  HelpCircle, Settings, Plus, Trash2, Save, Check, Eye, Menu, X, ChevronRight, LogOut,
  Bell, Search, Megaphone,
} from 'lucide-react'

// Institutional palette (admin only)
const NAVY = '#17243B'
const NAVY2 = '#243B5A'
const ACTION = '#3478E5'
const BG = '#F4F6FA'
const GOLD = '#D6A84B'

const SECTIONS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'PRINCIPAL' },
  { id: 'hero', label: 'Inicio / Hero', icon: Home, group: 'CONTENIDO WEB' },
  { id: 'aprender', label: 'Aprender', icon: BookOpen, group: 'CONTENIDO WEB' },
  { id: 'galeria', label: 'Galería', icon: ImageIcon, group: 'CONTENIDO WEB' },
  { id: 'anuncio', label: 'Anuncio', icon: Megaphone, group: 'CONTENIDO WEB' },
  { id: 'proyectos', label: 'Proyectos', icon: FolderKanban, group: 'PROGRAMAS Y SERVICIOS' },
  { id: 'robots', label: 'Robots niños', icon: Bot, group: 'PROGRAMAS Y SERVICIOS' },
  { id: 'proceso', label: 'Proceso', icon: Route, group: 'PROGRAMAS Y SERVICIOS' },
  { id: 'institucional', label: 'Institucional', icon: Building2, group: 'PROGRAMAS Y SERVICIOS' },
  { id: 'faq', label: 'Preguntas frecuentes', icon: HelpCircle, group: 'INFORMACIÓN' },
  { id: 'general', label: 'Configuración', icon: Settings, group: 'SISTEMA' },
]

export function AdminApp() {
  const { data, reset } = useCms()
  const [authed, setAuthed] = useState(false)
  const [username, setUsername] = useState('')
  const [pw, setPw] = useState('')
  const [pwErr, setPwErr] = useState('')
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2400)
  }, [])

  const login = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === (data.adminUsername || 'admin') && pw === (data.adminPassword || 'admin123$')) {
      setAuthed(true)
      setPwErr('')
    } else {
      setPwErr('Usuario o contraseña incorrectos')
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: BG }}>
        <form onSubmit={login} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <Logo size={44} />
            <div>
              <p className="font-display text-xl font-bold" style={{ color: NAVY }}>Panel de Administración</p>
              <p className="text-xs text-gray-500">Taller Municipal de Robótica · CMS Institucional</p>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium" style={{ color: NAVY }}>Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#3478E5] focus:ring-2 focus:ring-[#3478E5]/20 transition"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium" style={{ color: NAVY }}>Contraseña</label>
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#3478E5] focus:ring-2 focus:ring-[#3478E5]/20 transition"
              />
            </div>
            {pwErr && <p className="text-xs text-red-600">{pwErr}</p>}
          </div>
          <button type="submit" className="mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90" style={{ background: ACTION }}>
            Entrar al panel
          </button>
          <p className="mt-4 text-center text-xs text-gray-400">Acceso restringido · Uso institucional</p>
        </form>
      </div>
    )
  }

  const groups = Array.from(new Set(SECTIONS.map((s) => s.group)))
  const activeSection = SECTIONS.find((s) => s.id === active)
  const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen flex" style={{ background: BG }}>
      {toast && (
        <div className="fixed top-4 right-4 z-[200] flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg animate-fade-up" style={{ background: NAVY }}>
          <span className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: GOLD, color: NAVY }}>
            <Check className="h-3.5 w-3.5" />
          </span>
          <span>{toast}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col transition-all duration-200 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${sidebarCollapsed ? 'w-16' : 'w-64'}`}
        style={{ background: NAVY }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <Logo size={32} />
              <div>
                <p className="font-display text-sm font-bold text-white">CMS Institucional</p>
                <p className="text-[10px] text-white/50">Alcaldía Municipal</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden md:flex rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition"
            title={sidebarCollapsed ? 'Expandir' : 'Contraer'}
          >
            <Menu className="h-4 w-4" />
          </button>
          <button className="md:hidden rounded-lg p-1.5 text-white/60 hover:bg-white/10" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="overflow-y-auto p-2 space-y-4">
          {groups.map((g) => (
            <div key={g}>
              {!sidebarCollapsed && <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-white/30">{g}</p>}
              <div className="space-y-0.5">
                {SECTIONS.filter((s) => s.group === g).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setActive(s.id); setSidebarOpen(false) }}
                    title={sidebarCollapsed ? s.label : undefined}
                    className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition relative ${
                      active === s.id
                        ? 'text-white'
                        : 'text-white/60 hover:bg-white/8 hover:text-white'
                    }`}
                    style={active === s.id ? { background: NAVY2 } : undefined}
                  >
                    {active === s.id && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r" style={{ background: GOLD }} />
                    )}
                    <s.icon className="h-4 w-4 shrink-0" />
                    {!sidebarCollapsed && <span>{s.label}</span>}
                    {!sidebarCollapsed && active === s.id && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-50" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer profile */}
        <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2.5 mb-2 px-2 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold" style={{ background: GOLD, color: NAVY }}>
                A
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{data.adminUsername}</p>
                <p className="text-[10px] text-white/50 truncate">Administrador</p>
              </div>
            </div>
          )}
          <button
            onClick={() => { if (confirm('¿Cerrar sesión?')) setAuthed(false) }}
            title="Cerrar sesión"
            className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 transition"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!sidebarCollapsed && <span>Cerrar sesión</span>}
          </button>
          <button
            onClick={() => { if (confirm('¿Restaurar valores por defecto?')) { reset(); showToast('Valores restaurados') } }}
            title="Restaurar"
            className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 transition"
          >
            <Trash2 className="h-4 w-4 shrink-0" />
            {!sidebarCollapsed && <span>Restaurar</span>}
          </button>
          <button
            onClick={() => { window.location.hash = '' }}
            title="Ver sitio"
            className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-white/60 hover:bg-white/8 hover:text-white transition"
          >
            <Eye className="h-4 w-4 shrink-0" />
            {!sidebarCollapsed && <span>Ver sitio web</span>}
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 bg-white border-b border-gray-200 px-4 md:px-8 py-3">
          <div className="flex items-center gap-3">
            <button className="md:hidden rounded-lg p-2 hover:bg-gray-100" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" style={{ color: NAVY }} />
            </button>
            <div>
              <p className="text-xs text-gray-500 capitalize">{today}</p>
              <h1 className="font-display text-lg font-bold" style={{ color: NAVY }}>{activeSection?.label}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="hidden sm:flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-500">
              <Search className="h-4 w-4" /> Buscar...
            </button>
            <button className="rounded-lg p-2 hover:bg-gray-100 text-gray-500">
              <Bell className="h-5 w-5" />
            </button>
            <button onClick={() => showToast('Cambios guardados automáticamente')} className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90" style={{ background: ACTION }}>
              <Save className="h-4 w-4" /> Guardar
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-5xl">
            {active === 'dashboard' && <Dashboard />}
            {active === 'general' && <GeneralEditor showToast={showToast} />}
            {active === 'hero' && <HeroEditor showToast={showToast} />}
            {active === 'aprender' && <AprenderEditor showToast={showToast} />}
            {active === 'proceso' && <ProcesoEditor showToast={showToast} />}
            {active === 'galeria' && <GaleriaEditor showToast={showToast} />}
            {active === 'anuncio' && <AnuncioEditor showToast={showToast} />}
            {active === 'proyectos' && <ProyectosEditor showToast={showToast} />}
            {active === 'robots' && <RobotsEditor showToast={showToast} />}
            {active === 'institucional' && <InstitucionalEditor showToast={showToast} />}
            {active === 'faq' && <FaqEditor showToast={showToast} />}
          </div>
        </main>
      </div>
    </div>
  )
}

// ---------- helpers ----------

function Dashboard() {
  const { data } = useCms()
  const stats = [
    { label: 'Proyectos', value: data.projects.length, color: ACTION },
    { label: 'Preguntas FAQ', value: data.faqs.length, color: '#E83E99' },
    { label: 'Fotos galería', value: data.gallery.length, color: '#37C8E8' },
    { label: 'Robots niños', value: data.kidsRobots.length, color: GOLD },
    { label: 'Pasos proceso', value: data.journey.length, color: ACTION },
    { label: 'Tarjetas aprender', value: data.learningCards.length, color: '#E83E99' },
  ]
  const quickActions = [
    { label: 'Editar Hero', icon: Home, id: 'hero' },
    { label: 'Gestionar Galería', icon: ImageIcon, id: 'galeria' },
    { label: 'Proyectos', icon: FolderKanban, id: 'proyectos' },
    { label: 'Configuración', icon: Settings, id: 'general' },
  ]
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 capitalize">{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            <h2 className="font-display text-2xl font-bold mt-1" style={{ color: NAVY }}>Bienvenido, {data.adminUsername}</h2>
            <p className="text-sm text-gray-500 mt-1">Administra el contenido del Taller Municipal de Robótica.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold" style={{ background: '#EAF1FB', color: ACTION }}>
              <span className="h-2 w-2 rounded-full" style={{ background: '#22C55E' }} /> Sistema activo
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{s.label}</p>
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
            </div>
            <p className="mt-2 font-display text-3xl font-bold" style={{ color: NAVY }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="font-display text-lg font-bold mb-3" style={{ color: NAVY }}>Accesos rápidos</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((a) => (
            <button
              key={a.id}
              onClick={() => { const btn = document.querySelector(`[data-section="${a.id}"]`); if (btn) (btn as HTMLElement).click() }}
              className="flex items-center gap-3 rounded-2xl bg-white border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-[#3478E5]/30 transition text-left"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ background: ACTION }}>
                <a.icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold" style={{ color: NAVY }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
        <h3 className="font-display text-lg font-bold mb-3" style={{ color: NAVY }}>Actividad reciente</h3>
        <ul className="space-y-3">
          {[
            { text: 'Contenido del sitio cargado correctamente', time: 'Ahora' },
            { text: `Total de ${data.projects.length} proyectos publicados`, time: 'Hoy' },
            { text: `Total de ${data.faqs.length} preguntas frecuentes`, time: 'Hoy' },
            { text: `Total de ${data.gallery.length} imágenes en galería`, time: 'Hoy' },
          ].map((a, i) => (
            <li key={i} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{a.text}</span>
              <span className="text-xs text-gray-400">{a.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function ImageField({ label, value, onChange }: { label: string; value: string | null; onChange: (v: string | null) => void }) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result as string)
    reader.readAsDataURL(file)
  }
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium" style={{ color: NAVY }}>{label}</label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="url"
          value={value || ''}
          onChange={(e) => onChange(e.target.value || null)}
          placeholder="https://... o sube un archivo"
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#3478E5] focus:ring-2 focus:ring-[#3478E5]/20 transition"
        />
        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
          <ImageIcon className="h-4 w-4" /> Subir
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
        {value && (
          <button onClick={() => onChange(null)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600 hover:bg-red-100 transition">
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      {value && (
        <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
          <img src={value} alt="preview" className="h-32 w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        </div>
      )}
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', rows }: { label: string; value: string; onChange: (v: string) => void; type?: string; rows?: number }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium" style={{ color: NAVY }}>{label}</label>
      {rows ? (
        <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#3478E5] focus:ring-2 focus:ring-[#3478E5]/20 transition" />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#3478E5] focus:ring-2 focus:ring-[#3478E5]/20 transition" />
      )}
    </div>
  )
}

function GeneralEditor({ showToast }: { showToast: (m: string) => void }) {
  const { data, update } = useCms()
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold" style={{ color: NAVY }}>Configuración general</h1>
      <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm space-y-4">
        <Field label="Usuario admin" value={data.adminUsername} onChange={(v) => { update({ adminUsername: v }); showToast('Guardado') }} />
        <Field label="Contraseña admin" value={data.adminPassword} onChange={(v) => { update({ adminPassword: v }); showToast('Guardado') }} type="password" />
        <Field label="Nombre del programa" value={data.programName} onChange={(v) => { update({ programName: v }); showToast('Guardado') }} />
        <Field label="Municipalidad (Alcaldía)" value={data.municipality} onChange={(v) => { update({ municipality: v }); showToast('Guardado') }} />
        <Field label="Tagline" value={data.tagline} onChange={(v) => { update({ tagline: v }); showToast('Guardado') }} />
      </div>
    </div>
  )
}

function HeroEditor({ showToast }: { showToast: (m: string) => void }) {
  const { data, update } = useCms()
  const h = data.hero
  const set = (patch: Partial<typeof h>) => { update({ hero: { ...h, ...patch } }); showToast('Guardado') }
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold" style={{ color: NAVY }}>Hero</h1>
      <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm space-y-4">
        <Field label="Eyebrow" value={h.eyebrow} onChange={(v) => set({ eyebrow: v })} />
        <Field label="Título" value={h.title} onChange={(v) => set({ title: v })} />
        <Field label="Resaltar" value={h.highlight} onChange={(v) => set({ highlight: v })} />
        <Field label="Subtítulo" value={h.subtitle} onChange={(v) => set({ subtitle: v })} rows={3} />
        <Field label="Badge" value={h.badge} onChange={(v) => set({ badge: v })} />
        <Field label="Botón principal" value={h.ctaPrimary} onChange={(v) => set({ ctaPrimary: v })} />
        <Field label="Botón secundario" value={h.ctaSecondary} onChange={(v) => set({ ctaSecondary: v })} />
        <ImageField label="Imagen del hero (opcional)" value={data.heroImage} onChange={(v) => { update({ heroImage: v }); showToast('Guardado') }} />
      </div>
      <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm space-y-4">
        <Field label="Intro título" value={data.intro.title} onChange={(v) => { update({ intro: { ...data.intro, title: v } }); showToast('Guardado') }} />
        <Field label="Intro descripción" value={data.intro.text} onChange={(v) => { update({ intro: { ...data.intro, text: v } }); showToast('Guardado') }} rows={3} />
      </div>
    </div>
  )
}

function AprenderEditor({ showToast }: { showToast: (m: string) => void }) {
  const { data, update } = useCms()
  const cards = data.learningCards
  const setCards = (next: typeof cards) => { update({ learningCards: next }); showToast('Guardado') }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold" style={{ color: NAVY }}>Aprender</h1>
        <button onClick={() => setCards([...cards, { title: 'Nueva tarjeta', text: '' }])} className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-white" style={{ background: ACTION }}>
          <Plus className="h-4 w-4" /> Añadir
        </button>
      </div>
      {cards.map((c, i) => (
        <div key={i} className="rounded-2xl bg-white border border-gray-200 p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500">Tarjeta {i + 1}</p>
            <button onClick={() => setCards(cards.filter((_, j) => j !== i))} className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
          </div>
          <Field label="Título" value={c.title} onChange={(v) => { const n = [...cards]; n[i] = { ...n[i], title: v }; setCards(n) }} />
          <Field label="Texto" value={c.text} onChange={(v) => { const n = [...cards]; n[i] = { ...n[i], text: v }; setCards(n) }} rows={3} />
        </div>
      ))}
    </div>
  )
}

function ProcesoEditor({ showToast }: { showToast: (m: string) => void }) {
  const { data, update } = useCms()
  const journey = data.journey
  const setJourney = (next: typeof journey) => { update({ journey: next }); showToast('Guardado') }
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold" style={{ color: NAVY }}>Proceso</h1>
      {journey.map((j, i) => (
        <div key={i} className="rounded-2xl bg-white border border-gray-200 p-4 shadow-sm space-y-2">
          <p className="text-xs font-semibold text-gray-500">Paso {j.step}</p>
          <Field label="Título" value={j.title} onChange={(v) => { const n = [...journey]; n[i] = { ...n[i], title: v }; setJourney(n) }} />
          <Field label="Texto" value={j.text} onChange={(v) => { const n = [...journey]; n[i] = { ...n[i], text: v }; setJourney(n) }} rows={2} />
        </div>
      ))}
    </div>
  )
}

function GaleriaEditor({ showToast }: { showToast: (m: string) => void }) {
  const { data, update } = useCms()
  const gallery = data.gallery
  const setGallery = (next: typeof gallery) => { update({ gallery: next }); showToast('Guardado') }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold" style={{ color: NAVY }}>Galería</h1>
        <button onClick={() => setGallery([...gallery, { label: 'Nueva foto', color: 'from-brand-blue to-brand-cyan' }])} className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-white" style={{ background: ACTION }}>
          <Plus className="h-4 w-4" /> Añadir
        </button>
      </div>
      {gallery.map((g, i) => (
        <div key={i} className="rounded-2xl bg-white border border-gray-200 p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500">Foto {i + 1}</p>
            <button onClick={() => setGallery(gallery.filter((_, j) => j !== i))} className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
          </div>
          <Field label="Etiqueta" value={g.label} onChange={(v) => { const n = [...gallery]; n[i] = { ...n[i], label: v }; setGallery(n) }} />
          <Field label="Color (tailwind gradient)" value={g.color} onChange={(v) => { const n = [...gallery]; n[i] = { ...n[i], color: v }; setGallery(n) }} />
          <ImageField label="Imagen (opcional)" value={g.image || null} onChange={(v) => { const n = [...gallery]; n[i] = { ...n[i], image: v }; setGallery(n) }} />
        </div>
      ))}
    </div>
  )
}

function ProyectosEditor({ showToast }: { showToast: (m: string) => void }) {
  const { data, update } = useCms()
  const projects = data.projects
  const setProjects = (next: typeof projects) => { update({ projects: next }); showToast('Guardado') }
  const techs = data.projectsTechs
  const setTechs = (next: typeof techs) => { update({ projectsTechs: next }); showToast('Guardado') }
  const images = data.projectImages
  const setImages = (next: typeof images) => { update({ projectImages: next }); showToast('Guardado') }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold" style={{ color: NAVY }}>Proyectos</h1>
        <button onClick={() => { setProjects([...projects, { title: 'Nuevo proyecto', level: 'Básico', desc: '' }]); setTechs([...techs, ['Tech']]); setImages([...images, null]) }} className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-white" style={{ background: ACTION }}>
          <Plus className="h-4 w-4" /> Añadir
        </button>
      </div>
      {projects.map((p, i) => (
        <div key={i} className="rounded-2xl bg-white border border-gray-200 p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500">Proyecto {i + 1}</p>
            <button onClick={() => { setProjects(projects.filter((_, j) => j !== i)); setTechs(techs.filter((_, j) => j !== i)); setImages(images.filter((_, j) => j !== i)) }} className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
          </div>
          <Field label="Título" value={p.title} onChange={(v) => { const n = [...projects]; n[i] = { ...n[i], title: v }; setProjects(n) }} />
          <Field label="Nivel" value={p.level} onChange={(v) => { const n = [...projects]; n[i] = { ...n[i], level: v }; setProjects(n) }} />
          <Field label="Descripción" value={p.desc} onChange={(v) => { const n = [...projects]; n[i] = { ...n[i], desc: v }; setProjects(n) }} rows={2} />
          <Field label="Tecnologías (coma)" value={(techs[i] || []).join(', ')} onChange={(v) => { const n = [...techs]; n[i] = v.split(',').map((s) => s.trim()).filter(Boolean); setTechs(n) }} />
          <ImageField label="Imagen (opcional)" value={images[i] || null} onChange={(v) => { const n = [...images]; n[i] = v; setImages(n) }} />
        </div>
      ))}
    </div>
  )
}

function RobotsEditor({ showToast }: { showToast: (m: string) => void }) {
  const { data, update } = useCms()
  const robots = data.kidsRobots
  const setRobots = (next: typeof robots) => { update({ kidsRobots: next }); showToast('Guardado') }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold" style={{ color: NAVY }}>Robots de los niños</h1>
        <button onClick={() => setRobots([...robots, { name: 'Nuevo robot', desc: '', level: 'Básico' }])} className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-white" style={{ background: ACTION }}>
          <Plus className="h-4 w-4" /> Añadir
        </button>
      </div>
      {robots.map((r, i) => (
        <div key={i} className="rounded-2xl bg-white border border-gray-200 p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500">Robot {i + 1}</p>
            <button onClick={() => setRobots(robots.filter((_, j) => j !== i))} className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
          </div>
          <Field label="Nombre" value={r.name} onChange={(v) => { const n = [...robots]; n[i] = { ...n[i], name: v }; setRobots(n) }} />
          <Field label="Descripción" value={r.desc} onChange={(v) => { const n = [...robots]; n[i] = { ...n[i], desc: v }; setRobots(n) }} rows={2} />
          <Field label="Nivel" value={r.level} onChange={(v) => { const n = [...robots]; n[i] = { ...n[i], level: v }; setRobots(n) }} />
          <ImageField label="Imagen (opcional)" value={r.image || null} onChange={(v) => { const n = [...robots]; n[i] = { ...n[i], image: v }; setRobots(n) }} />
        </div>
      ))}
    </div>
  )
}

function InstitucionalEditor({ showToast }: { showToast: (m: string) => void }) {
  const { data, update } = useCms()
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold" style={{ color: NAVY }}>Institucional</h1>
      <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm space-y-4">
        <Field label="Municipalidad" value={data.municipality} onChange={(v) => { update({ municipality: v }); showToast('Guardado') }} />
        <Field label="Email contacto (opcional)" value={data.contact.email || ''} onChange={(v) => { update({ contact: { ...data.contact, email: v || null } }); showToast('Guardado') }} />
        <Field label="Teléfono (opcional)" value={data.contact.phone || ''} onChange={(v) => { update({ contact: { ...data.contact, phone: v || null } }); showToast('Guardado') }} />
        <Field label="Dirección (opcional)" value={data.contact.address || ''} onChange={(v) => { update({ contact: { ...data.contact, address: v || null } }); showToast('Guardado') }} />
        <ImageField label="Imagen institucional (opcional)" value={data.institutionalImage} onChange={(v) => { update({ institutionalImage: v }); showToast('Guardado') }} />
      </div>
    </div>
  )
}

function FaqEditor({ showToast }: { showToast: (m: string) => void }) {
  const { data, update } = useCms()
  const faqs = data.faqs
  const setFaqs = (next: typeof faqs) => { update({ faqs: next }); showToast('Guardado') }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold" style={{ color: NAVY }}>Preguntas frecuentes</h1>
        <button onClick={() => setFaqs([...faqs, { q: 'Nueva pregunta', a: '' }])} className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-white" style={{ background: ACTION }}>
          <Plus className="h-4 w-4" /> Añadir
        </button>
      </div>
      {faqs.map((f, i) => (
        <div key={i} className="rounded-2xl bg-white border border-gray-200 p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500">Pregunta {i + 1}</p>
            <button onClick={() => setFaqs(faqs.filter((_, j) => j !== i))} className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
          </div>
          <Field label="Pregunta" value={f.q} onChange={(v) => { const n = [...faqs]; n[i] = { ...n[i], q: v }; setFaqs(n) }} />
          <Field label="Respuesta" value={f.a} onChange={(v) => { const n = [...faqs]; n[i] = { ...n[i], a: v }; setFaqs(n) }} rows={3} />
        </div>
      ))}
    </div>
  )
}

function AnuncioEditor({ showToast }: { showToast: (m: string) => void }) {
  const { data, update } = useCms()
  const items = data.announcements || []
  const setItems = (next: typeof items) => { update({ announcements: next }); showToast('Guardado') }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold" style={{ color: NAVY }}>Anuncios emergentes</h1>
        <button
          onClick={() => setItems([...items, { enabled: true, title: 'Nuevo anuncio', text: '', image: null, cta: 'Ver más', link: '#' }])}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-white"
          style={{ background: ACTION }}
        >
          <Plus className="h-4 w-4" /> Añadir anuncio
        </button>
      </div>
      {items.map((a, i) => (
        <div key={i} className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500">Anuncio {i + 1}</p>
            <button onClick={() => setItems(items.filter((_, j) => j !== i))} className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={a.enabled}
              onChange={(e) => { const n = [...items]; n[i] = { ...n[i], enabled: e.target.checked }; setItems(n) }}
              className="h-4 w-4 rounded border-gray-300 text-[#3478E5] focus:ring-[#3478E5]"
            />
            <span className="text-sm font-medium" style={{ color: NAVY }}>Activar este anuncio</span>
          </label>
          <Field label="Título" value={a.title} onChange={(v) => { const n = [...items]; n[i] = { ...n[i], title: v }; setItems(n) }} />
          <Field label="Texto" value={a.text} onChange={(v) => { const n = [...items]; n[i] = { ...n[i], text: v }; setItems(n) }} rows={3} />
          <Field label="Texto del botón (CTA)" value={a.cta} onChange={(v) => { const n = [...items]; n[i] = { ...n[i], cta: v }; setItems(n) }} />
          <Field label="Enlace del botón" value={a.link} onChange={(v) => { const n = [...items]; n[i] = { ...n[i], link: v }; setItems(n) }} />
          <ImageField label="Imagen (opcional)" value={a.image} onChange={(v) => { const n = [...items]; n[i] = { ...n[i], image: v }; setItems(n) }} />
        </div>
      ))}
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-xs text-gray-500">
        Los anuncios activos aparecen como ventanas emergentes animadas. Si hay varios, se muestran uno tras otro al cerrar el anterior. El usuario puede cerrarlos y no vuelven a aparecer en esa sesión.
      </div>
    </div>
  )
}
