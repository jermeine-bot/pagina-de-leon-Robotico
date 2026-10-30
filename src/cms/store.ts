import { siteConfig } from '@/config/site'

export type CmsData = typeof siteConfig & {
  learningCards: { title: string; text: string }[]
  gallery: { label: string; color: string; image?: string | null }[]
  kidsRobots: { name: string; desc: string; level: string; image?: string | null }[]
  projectsTechs: string[][]
  projectImages: (string | null)[]
  heroImage: string | null
  institutionalImage: string | null
  adminUsername: string
  adminPassword: string
}

export const DEFAULT_DATA: CmsData = {
  ...siteConfig,
  learningCards: [
    { title: 'Construcción con LEGO', text: 'Los estudiantes construyen modelos, exploran mecanismos y descubren cómo transformar sus ideas en objetos funcionales.' },
    { title: 'Programación y lógica', text: 'Aprenden a dar instrucciones, comprender secuencias, experimentar con algoritmos y resolver pequeños desafíos.' },
    { title: 'Robótica con Sparki', text: 'Experimentan con sensores, movimiento y programación para comprender cómo un robot percibe su entorno y ejecuta instrucciones.' },
  ],
  gallery: [
    { label: 'Estudiantes trabajando en equipo', color: 'from-brand-blue to-brand-cyan' },
    { label: 'Kits LEGO Education', color: 'from-brand-yellow to-brand-magenta' },
    { label: 'Robot Sparki en acción', color: 'from-brand-cyan to-brand-blue' },
    { label: 'Actividades educativas', color: 'from-brand-magenta to-brand-yellow' },
    { label: 'Proyectos construidos', color: 'from-brand-blue to-brand-magenta' },
    { label: 'Sesión de programación', color: 'from-brand-yellow to-brand-cyan' },
  ],
  kidsRobots: [
    { name: 'Robot Explorador', desc: 'Avanza, detecta obstáculos y cambia de dirección automáticamente.', level: 'Básico' },
    { name: 'Brazo Selector', desc: 'Recoge objetos pequeños y los clasifica por color.', level: 'Intermedio' },
    { name: 'Vehículo Seguidor', desc: 'Sigue una línea en el suelo usando sensores de luz.', level: 'Intermedio' },
    { name: 'Alarma Creativa', desc: 'Detecta movimiento y avisa con luz y sonido.', level: 'Básico' },
    { name: 'Robot Bailarín', desc: 'Ejecuta secuencias de movimiento al ritmo de una melodía.', level: 'Avanzado' },
    { name: 'Máquina Clasificadora', desc: 'Separa piezas por tamaño usando sensores y motores.', level: 'Avanzado' },
  ],
  projectsTechs: [
    ['Sensores', 'Movimiento'],
    ['Mecanismos', 'Tracción'],
    ['Sensores', 'Lectura'],
    ['Secuencias', 'Control'],
    ['Engranajes', 'Palancas'],
    ['Algoritmos', 'Trabajo en equipo'],
  ],
  projectImages: [null, null, null, null, null, null],
  heroImage: null,
  institutionalImage: null,
  adminUsername: 'admin',
  adminPassword: 'admin123$',
}

const KEY = 'cms_data_v1'

export function loadCms(): CmsData {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<CmsData>
      const merged = { ...DEFAULT_DATA, ...parsed } as CmsData
      if (merged.adminPassword === 'admin123') merged.adminPassword = 'admin123$'
      if (!merged.adminUsername) merged.adminUsername = 'admin'
      return merged
    }
  } catch (e) {
    console.warn('cms load error', e)
  }
  return { ...DEFAULT_DATA }
}

export function saveCms(data: CmsData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('cms save error', e)
  }
}
