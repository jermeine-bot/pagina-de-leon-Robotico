import { createContext, useContext, useState, useCallback } from 'react'
import { loadCms, saveCms, type CmsData } from './store'

type Ctx = {
  data: CmsData
  update: (patch: Partial<CmsData>) => void
  reset: () => void
}

const CmsContext = createContext<Ctx | null>(null)

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CmsData>(() => loadCms())

  const update = useCallback((patch: Partial<CmsData>) => {
    setData((prev) => {
      const next = { ...prev, ...patch }
      saveCms(next)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    localStorage.removeItem('cms_data_v1')
    setData(loadCms())
  }, [])

  return <CmsContext.Provider value={{ data, update, reset }}>{children}</CmsContext.Provider>
}

export function useCms() {
  const ctx = useContext(CmsContext)
  if (!ctx) throw new Error('useCms must be used within CmsProvider')
  return ctx
}
