import { useCallback, useEffect, useState } from 'react'
import {
  Bell,
  BookOpen,
  Bot,
  Building2,
  ChevronRight,
  Eye,
  FolderKanban,
  HelpCircle,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  Loader2,
  LogOut,
  Megaphone,
  Menu,
  Route,
  Settings,
  X,
  Check,
} from 'lucide-react'
import { ApiError } from '@/api/client'
import { Logo } from '@/components/Logo'
import { useCms } from './CmsContext'
import type { AuditEntry } from './types'
import { ACTION, BG, GOLD, NAVY, NAVY2, inputClass, primaryButton } from './theme'
import { HeroEditor } from './editors/HeroEditor'
import { AprenderEditor } from './editors/AprenderEditor'
import { ProcesoEditor } from './editors/ProcesoEditor'
import { GaleriaEditor } from './editors/GaleriaEditor'
import { ProyectosEditor } from './editors/ProyectosEditor'
import { RobotsEditor } from './editors/RobotsEditor'
import { InstitucionalEditor } from './editors/InstitucionalEditor'
import { FaqEditor } from './editors/FaqEditor'
import { AnuncioEditor } from './editors/AnuncioEditor'
import { GeneralEditor } from './editors/GeneralEditor'

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
] as const

type SectionId = (typeof SECTIONS)[number]['id']

export function AdminApp() {
  const { user, authChecked, status, error, logout } = useCms()
  const [active, setActive] = useState<SectionId>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }, [])

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: BG }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: ACTION }} />
      </div>
    )
  }

  if (!user) {
    return <LoginScreen />
  }

  const groups = Array.from(new Set(SECTIONS.map((section) => section.group)))
  const activeSection = SECTIONS.find((section) => section.id === active)
  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const handleLogout = async () => {
    if (!confirm('¿Cerrar sesión?')) return
    await logout()
  }

  return (
    <div className="flex min-h-screen" style={{ background: BG }}>
      {toast && (
        <div
          className="fixed right-4 top-4 z-[200] flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg animate-fade-up"
          style={{ background: NAVY }}
          role="status"
        >
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full"
            style={{ background: GOLD, color: NAVY }}
          >
            <Check className="h-3.5 w-3.5" />
          </span>
          <span>{toast}</span>
        </div>
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-200 md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${sidebarCollapsed ? 'w-16' : 'w-64'}`}
        style={{ background: NAVY }}
      >
        <div
          className="flex items-center justify-between border-b p-4"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
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
            type="button"
            onClick={() => setSidebarCollapsed((value) => !value)}
            className="hidden rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white md:flex"
            title={sidebarCollapsed ? 'Expandir' : 'Contraer'}
          >
            <Menu className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar menú"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto p-2">
          {groups.map((group) => (
            <div key={group}>
              {!sidebarCollapsed && (
                <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                  {group}
                </p>
              )}
              <div className="space-y-0.5">
                {SECTIONS.filter((section) => section.group === group).map((section) => (
                  <button
                    type="button"
                    key={section.id}
                    onClick={() => {
                      setActive(section.id)
                      setSidebarOpen(false)
                    }}
                    title={sidebarCollapsed ? section.label : undefined}
                    className={`relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      active === section.id ? 'text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                    style={active === section.id ? { background: NAVY2 } : undefined}
                  >
                    {active === section.id && (
                      <span
                        className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r"
                        style={{ background: GOLD }}
                      />
                    )}
                    <section.icon className="h-4 w-4 shrink-0" />
                    {!sidebarCollapsed && <span>{section.label}</span>}
                    {!sidebarCollapsed && active === section.id && (
                      <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-50" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t p-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          {!sidebarCollapsed && (
            <div
              className="mb-2 flex items-center gap-2.5 rounded-lg px-2 py-2"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                style={{ background: GOLD, color: NAVY }}
              >
                {user.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{user.displayName}</p>
                <p className="truncate text-[10px] text-white/50">
                  {user.role === 'admin' ? 'Administrador' : 'Editor'}
                </p>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => void handleLogout()}
            title="Cerrar sesión"
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!sidebarCollapsed && <span>Cerrar sesión</span>}
          </button>
          <button
            type="button"
            onClick={() => {
              window.location.hash = ''
            }}
            title="Ver sitio"
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <Eye className="h-4 w-4 shrink-0" />
            {!sidebarCollapsed && <span>Ver sitio web</span>}
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 hover:bg-gray-100 md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" style={{ color: NAVY }} />
            </button>
            <div>
              <p className="text-xs capitalize text-gray-500">{today}</p>
              <h1 className="font-display text-lg font-bold" style={{ color: NAVY }}>
                {activeSection?.label}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {status === 'error' && (
              <span
                className="hidden items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 sm:inline-flex"
                title={error ?? undefined}
              >
                <Bell className="h-3.5 w-3.5" /> Sin conexión al API
              </span>
            )}
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: ACTION }}
            >
              <Eye className="h-4 w-4" /> Ver sitio
            </a>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-5xl">
            {active === 'dashboard' && <Dashboard onNavigate={setActive} />}
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

function LoginScreen() {
  const { login } = useCms()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username.trim(), password)
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : 'No se pudo iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4" style={{ background: BG }}>
      <form
        onSubmit={(event) => void submit(event)}
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg"
      >
        <div className="flex items-center gap-3">
          <Logo size={44} />
          <div>
            <p className="font-display text-xl font-bold" style={{ color: NAVY }}>
              Panel de Administración
            </p>
            <p className="text-xs text-gray-500">Taller Municipal de Robótica · CMS Institucional</p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: NAVY }}>
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              autoFocus
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: NAVY }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              className={inputClass}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={loading || username.trim() === '' || password === ''}
          className={`mt-6 w-full ${primaryButton}`}
          style={{ background: ACTION, paddingBlock: '0.7rem' }}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? 'Entrando…' : 'Entrar al panel'}
        </button>
        <p className="mt-4 text-center text-xs text-gray-400">Acceso restringido · Uso institucional</p>
      </form>
    </div>
  )
}

const ACTION_LABELS: Record<string, string> = {
  'auth.login': 'Inicio de sesión',
  'auth.logout': 'Cierre de sesión',
  'auth.password': 'Cambio de contraseña',
  'content.update': 'Sección actualizada',
  'content.reset': 'Contenido restaurado',
  'content.import': 'Respaldo importado',
  'media.upload': 'Imagen subida',
  'media.delete': 'Imagen eliminada',
}

function formatDate(value: string): string {
  const date = new Date(value.replace(' ', 'T'))

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function Dashboard({ onNavigate }: { onNavigate: (section: SectionId) => void }) {
  const { data, user, activity, status, error } = useCms()
  const [entries, setEntries] = useState<AuditEntry[] | null>(null)

  useEffect(() => {
    let cancelled = false
    activity()
      .then((result) => {
        if (!cancelled) setEntries(result)
      })
      .catch(() => {
        if (!cancelled) setEntries([])
      })

    return () => {
      cancelled = true
    }
  }, [activity])

  const stats = [
    { label: 'Proyectos', value: data.projects.length, color: ACTION },
    { label: 'Preguntas FAQ', value: data.faqs.length, color: '#E83E99' },
    { label: 'Fotos galería', value: data.gallery.length, color: '#37C8E8' },
    { label: 'Robots niños', value: data.kidsRobots.length, color: GOLD },
    { label: 'Pasos proceso', value: data.journey.length, color: ACTION },
    { label: 'Tarjetas aprender', value: data.learningCards.length, color: '#E83E99' },
  ]

  const quickActions: { label: string; icon: typeof Home; id: SectionId }[] = [
    { label: 'Editar Hero', icon: Home, id: 'hero' },
    { label: 'Gestionar Galería', icon: ImageIcon, id: 'galeria' },
    { label: 'Proyectos', icon: FolderKanban, id: 'proyectos' },
    { label: 'Configuración', icon: Settings, id: 'general' },
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm capitalize text-gray-500">
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold" style={{ color: NAVY }}>
              Bienvenido, {user?.displayName}
            </h2>
            <p className="mt-1 text-sm text-gray-500">Administra el contenido del Taller Municipal de Robótica.</p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
              status === 'ready' ? '' : 'text-amber-700'
            }`}
            style={status === 'ready' ? { background: '#EAF1FB', color: ACTION } : { background: '#FEF3C7' }}
            title={error ?? undefined}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: status === 'ready' ? '#22C55E' : '#F59E0B' }}
            />
            {status === 'ready' ? 'Sistema conectado' : 'Contenido de respaldo'}
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: stat.color }} />
            </div>
            <p className="mt-2 font-display text-3xl font-bold" style={{ color: NAVY }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="mb-3 font-display text-lg font-bold" style={{ color: NAVY }}>
          Accesos rápidos
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <button
              type="button"
              key={action.id}
              onClick={() => onNavigate(action.id)}
              className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-[#3478E5]/30 hover:shadow-md"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                style={{ background: ACTION }}
              >
                <action.icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold" style={{ color: NAVY }}>
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 font-display text-lg font-bold" style={{ color: NAVY }}>
          Actividad reciente
        </h3>
        {entries === null ? (
          <p className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Cargando…
          </p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-gray-500">Todavía no hay actividad registrada.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {entries.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <span className="min-w-0 text-gray-600">
                  <span className="font-medium" style={{ color: NAVY }}>
                    {ACTION_LABELS[entry.action] ?? entry.action}
                  </span>
                  {entry.target && <span className="text-gray-400"> · {entry.target}</span>}
                  {entry.display_name && <span className="text-gray-400"> · {entry.display_name}</span>}
                </span>
                <span className="shrink-0 text-xs text-gray-400">{formatDate(entry.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
