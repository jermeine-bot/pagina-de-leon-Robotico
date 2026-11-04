export type Level = 'Básico' | 'Intermedio' | 'Avanzado'

export const GRADIENTS = {
  'blue-cyan': 'from-brand-blue to-brand-cyan',
  'yellow-magenta': 'from-brand-yellow to-brand-magenta',
  'cyan-blue': 'from-brand-cyan to-brand-blue',
  'magenta-yellow': 'from-brand-magenta to-brand-yellow',
  'blue-magenta': 'from-brand-blue to-brand-magenta',
  'yellow-cyan': 'from-brand-yellow to-brand-cyan',
} as const

export type GradientKey = keyof typeof GRADIENTS

export const LEVELS: Level[] = ['Básico', 'Intermedio', 'Avanzado']

export type JourneyStep = { step: string; title: string; text: string }
export type LearningCard = { title: string; text: string }
export type GalleryItem = { label: string; gradient: GradientKey; image: string | null }
export type Project = { title: string; level: Level; desc: string; techs: string[]; image: string | null }
export type KidRobot = { name: string; desc: string; level: Level; image: string | null }
export type Partner = { name: string; logo: string | null }
export type Faq = { q: string; a: string }

export type Announcement = {
  enabled: boolean
  title: string
  text: string
  image: string | null
  cta: string
  link: string
}

export type CmsData = {
  settings: { programName: string; municipality: string; tagline: string }
  hero: {
    eyebrow: string
    title: string
    highlight: string
    accent: string
    subtitle: string
    badge: string
    ctaPrimary: string
    ctaSecondary: string
    image: string | null
  }
  intro: { title: string; text: string }
  journey: JourneyStep[]
  learningCards: LearningCard[]
  gallery: GalleryItem[]
  projects: Project[]
  kidsRobots: KidRobot[]
  institutional: { heading: string; text: string; image: string | null; partners: Partner[] }
  faqs: Faq[]
  contact: { email: string | null; phone: string | null; whatsapp: string | null; address: string | null }
  announcements: Announcement[]
}

export type SectionKey = keyof CmsData
export type SectionContent<K extends SectionKey = SectionKey> = CmsData[K]
export type CmsVersions = Record<SectionKey, number>

export type CmsUser = {
  id: number
  username: string
  displayName: string
  role: 'admin' | 'editor'
}

export type AuditEntry = {
  id: number
  action: string
  target: string | null
  metadata: string | null
  created_at: string
  username: string | null
  display_name: string | null
}
