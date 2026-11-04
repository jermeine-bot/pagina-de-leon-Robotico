import type {
  AuditEntry,
  CmsData,
  CmsUser,
  CmsVersions,
  SectionContent,
  SectionKey,
} from '@/cms/types'

const BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, '') || '/api'

export type ApiFieldError = { field: string; message: string }

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors: Record<string, string> = {},
    public readonly current?: { content: unknown; version: number },
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

type RequestOptions = {
  method?: string
  body?: unknown
  csrf?: string | null
  signal?: AbortSignal
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  if (options.csrf) {
    headers['X-CSRF-Token'] = options.csrf
  }

  let response: Response
  try {
    response = await fetch(`${BASE}${path}`, {
      method: options.method ?? 'GET',
      credentials: 'include',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: options.signal,
    })
  } catch (error) {
    if ((error as Error).name === 'AbortError') throw error
    throw new ApiError('No se pudo conectar con el servidor.', 0)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const payload = (await response.json().catch(() => null)) as
    | { error?: { message?: string; errors?: Record<string, string>; current?: { content: unknown; version: number } } }
    | null

  if (!response.ok) {
    const apiError = payload?.error
    throw new ApiError(
      apiError?.message ?? `Error ${response.status}`,
      response.status,
      apiError?.errors ?? {},
      apiError?.current,
    )
  }

  return payload as T
}

export type ContentResponse = { data: CmsData; meta: { versions: CmsVersions; updatedAt: string | null } }

export const api = {
  getContent: (signal?: AbortSignal) => request<ContentResponse>('/content', { signal }),

  me: (signal?: AbortSignal) =>
    request<{ user: CmsUser | null; csrfToken: string | null }>('/auth/me', { signal }),

  login: (username: string, password: string) =>
    request<{ user: CmsUser; csrfToken: string }>('/auth/login', {
      method: 'POST',
      body: { username, password },
    }),

  logout: (csrf: string) =>
    request<{ ok: true }>('/auth/logout', { method: 'POST', csrf }),

  changePassword: (csrf: string, currentPassword: string, newPassword: string) =>
    request<{ ok: true }>('/auth/password', {
      method: 'PUT',
      csrf,
      body: { currentPassword, newPassword },
    }),

  updateSection: <K extends SectionKey>(csrf: string, section: K, content: SectionContent<K>, version: number) =>
    request<{ data: SectionContent<K>; meta: { section: K; version: number; updatedAt: string } }>(
      `/content/${section}`,
      { method: 'PUT', csrf, body: { content, version } },
    ),

  resetContent: (csrf: string) =>
    request<ContentResponse>('/content/reset', { method: 'POST', csrf }),

  importContent: (csrf: string, content: Partial<CmsData>) =>
    request<ContentResponse>('/content/import', { method: 'POST', csrf, body: { content } }),

  exportContent: (csrf: string) =>
    request<{ content: CmsData; meta: { versions: CmsVersions; updatedAt: string | null } }>(
      '/content/export',
      { csrf },
    ),

  activity: (signal?: AbortSignal) =>
    request<{ data: AuditEntry[] }>('/content/activity', { signal }),

  uploadMedia: async (csrf: string, file: File) => {
    const form = new FormData()
    form.append('file', file)

    let response: Response
    try {
      response = await fetch(`${BASE}/media`, {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json', 'X-CSRF-Token': csrf },
        body: form,
      })
    } catch {
      throw new ApiError('No se pudo subir la imagen.', 0)
    }

    const payload = (await response.json().catch(() => null)) as
      | { data?: { url: string }; error?: { message?: string } }
      | null

    if (!response.ok || !payload?.data) {
      throw new ApiError(payload?.error?.message ?? 'No se pudo subir la imagen.', response.status)
    }

    return payload.data
  },
}
