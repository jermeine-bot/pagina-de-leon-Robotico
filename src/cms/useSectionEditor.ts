import { useCallback, useEffect, useMemo, useState } from 'react'
import { ApiError } from '@/api/client'
import { useCms } from './CmsContext'
import type { SectionContent, SectionKey } from './types'

type Options = {
  onSaved?: (message: string) => void
}

export function useSectionEditor<K extends SectionKey>(section: K, options: Options = {}) {
  const { data, updateSection, refresh } = useCms()
  const value = data[section] as SectionContent<K>

  const [draft, setDraft] = useState<SectionContent<K>>(value)
  const [baseline, setBaseline] = useState<SectionContent<K>>(value)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [conflict, setConflict] = useState(false)

  useEffect(() => {
    setDraft(value)
    setBaseline(value)
    setConflict(false)
  }, [value])

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(baseline),
    [draft, baseline],
  )

  const save = useCallback(async () => {
    setSaving(true)
    setError('')
    try {
      await updateSection(section, draft)
      options.onSaved?.('Cambios guardados')
    } catch (caught) {
      if (caught instanceof ApiError) {
        const details = [...new Set(Object.values(caught.errors))]
        setError(details.length > 0 ? `${caught.message} ${details.join(' ')}` : caught.message)
        setConflict(caught.status === 409)
      } else {
        setError('No se pudo guardar. Revisa tu conexión.')
      }
    } finally {
      setSaving(false)
    }
    // options.onSaved is stable enough for an editor page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, section, updateSection])

  const reset = useCallback(() => {
    setDraft(baseline)
    setError('')
    setConflict(false)
  }, [baseline])

  const reload = useCallback(async () => {
    setSaving(true)
    try {
      await refresh()
    } finally {
      setSaving(false)
    }
  }, [refresh])

  return { draft, setDraft, dirty, saving, error, conflict, save, reset, reload }
}
