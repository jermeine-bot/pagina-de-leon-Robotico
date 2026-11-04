import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ApiError, api } from '@/api/client'
import { DEFAULT_DATA, DEFAULT_VERSIONS, SECTION_KEYS } from './defaults'
import type {
  AuditEntry,
  CmsData,
  CmsUser,
  CmsVersions,
  SectionContent,
  SectionKey,
} from './types'

type Status = 'loading' | 'ready' | 'error'

type Ctx = {
  data: CmsData
  versions: CmsVersions
  status: Status
  error: string | null
  user: CmsUser | null
  authChecked: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  refresh: () => Promise<void>
  updateSection: <K extends SectionKey>(section: K, content: SectionContent<K>) => Promise<void>
  reset: () => Promise<void>
  importContent: (content: Partial<CmsData>) => Promise<void>
  exportContent: () => Promise<CmsData>
  uploadImage: (file: File) => Promise<string>
  activity: () => Promise<AuditEntry[]>
}

const CmsContext = createContext<Ctx | null>(null)

function mergeData(data: Partial<CmsData>): CmsData {
  return { ...DEFAULT_DATA, ...data }
}

function mergeVersions(versions: Partial<CmsVersions>): CmsVersions {
  const merged = { ...DEFAULT_VERSIONS }
  for (const key of SECTION_KEYS) {
    if (typeof versions[key] === 'number') merged[key] = versions[key] as number
  }

  return merged
}

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CmsData>(DEFAULT_DATA)
  const [versions, setVersions] = useState<CmsVersions>(DEFAULT_VERSIONS)
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<CmsUser | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [csrfToken, setCsrfToken] = useState<string | null>(null)

  const applyContent = useCallback(
    (payload: { data: CmsData; meta: { versions: CmsVersions } }) => {
      setData(mergeData(payload.data))
      setVersions(mergeVersions(payload.meta.versions))
    },
    [],
  )

  const refresh = useCallback(async () => {
    try {
      const payload = await api.getContent()
      applyContent(payload)
      setStatus('ready')
      setError(null)
    } catch (caught) {
      setStatus('error')
      setError(
        caught instanceof ApiError && caught.status === 0
          ? 'No se pudo conectar con el servidor. Se muestra el contenido de respaldo.'
          : 'No se pudo cargar el contenido del sitio.',
      )
    }
  }, [applyContent])

  const checkAuth = useCallback(async () => {
    try {
      const payload = await api.me()
      setUser(payload.user)
      setCsrfToken(payload.csrfToken)
    } catch {
      setUser(null)
      setCsrfToken(null)
    } finally {
      setAuthChecked(true)
    }
  }, [])

  useEffect(() => {
    void refresh()
    void checkAuth()
  }, [refresh, checkAuth])

  const login = useCallback(async (username: string, password: string) => {
    const payload = await api.login(username, password)
    setUser(payload.user)
    setCsrfToken(payload.csrfToken)
  }, [])

  const logout = useCallback(async () => {
    if (csrfToken) {
      try {
        await api.logout(csrfToken)
      } catch {
        // La sesión local se limpia igual.
      }
    }
    setUser(null)
    setCsrfToken(null)
  }, [csrfToken])

  const requireCsrf = useCallback((): string => {
    if (!csrfToken) {
      throw new ApiError('Tu sesión expiró. Vuelve a iniciar sesión.', 401)
    }

    return csrfToken
  }, [csrfToken])

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      await api.changePassword(requireCsrf(), currentPassword, newPassword)
    },
    [requireCsrf],
  )

  const updateSection = useCallback(
    async <K extends SectionKey>(section: K, content: SectionContent<K>) => {
      const token = requireCsrf()
      const payload = await api.updateSection(token, section, content, versions[section] ?? 0)
      setData((previous) => ({ ...previous, [section]: payload.data }))
      setVersions((previous) => ({ ...previous, [section]: payload.meta.version }))
    },
    [requireCsrf, versions],
  )

  const reset = useCallback(async () => {
    const payload = await api.resetContent(requireCsrf())
    applyContent(payload)
  }, [applyContent, requireCsrf])

  const importContent = useCallback(
    async (content: Partial<CmsData>) => {
      const payload = await api.importContent(requireCsrf(), content)
      applyContent(payload)
    },
    [applyContent, requireCsrf],
  )

  const exportContent = useCallback(async () => {
    const payload = await api.exportContent(requireCsrf())

    return payload.content
  }, [requireCsrf])

  const uploadImage = useCallback(
    async (file: File) => {
      const payload = await api.uploadMedia(requireCsrf(), file)

      return payload.url
    },
    [requireCsrf],
  )

  const activity = useCallback(async () => {
    const payload = await api.activity()

    return payload.data
  }, [])

  const value = useMemo<Ctx>(
    () => ({
      data,
      versions,
      status,
      error,
      user,
      authChecked,
      login,
      logout,
      changePassword,
      refresh,
      updateSection,
      reset,
      importContent,
      exportContent,
      uploadImage,
      activity,
    }),
    [
      data,
      versions,
      status,
      error,
      user,
      authChecked,
      login,
      logout,
      changePassword,
      refresh,
      updateSection,
      reset,
      importContent,
      exportContent,
      uploadImage,
      activity,
    ],
  )

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>
}

export function useCms() {
  const ctx = useContext(CmsContext)
  if (!ctx) throw new Error('useCms must be used within CmsProvider')

  return ctx
}
