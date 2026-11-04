import { useRef, useState } from 'react'
import { Image as ImageIcon, Loader2, Trash2 } from 'lucide-react'
import { useCms } from '../CmsContext'
import { inputClass, NAVY, secondaryButton } from '../theme'

type Props = {
  label: string
  value: string | null
  onChange: (value: string | null) => void
  hint?: string
}

const MAX_BYTES = 5 * 1024 * 1024

export function ImageField({ label, value, onChange, hint }: Props) {
  const { uploadImage } = useCms()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setError('')

    if (!file.type.startsWith('image/')) {
      setError('Selecciona una imagen JPG, PNG, WEBP o GIF.')

      return
    }
    if (file.size > MAX_BYTES) {
      setError('La imagen supera los 5 MB.')

      return
    }

    setUploading(true)
    try {
      const url = await uploadImage(file)
      onChange(url)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo subir la imagen.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium" style={{ color: NAVY }}>
        {label}
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value || null)}
          placeholder="/api/uploads/... o https://..."
          className={inputClass}
        />
        <label className={`${secondaryButton} cursor-pointer`}>
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
          {uploading ? 'Subiendo…' : 'Subir'}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            disabled={uploading}
            onChange={(event) => void handleFile(event.target.files?.[0])}
          />
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-600 transition hover:bg-red-100"
            aria-label="Quitar imagen"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {value && (
        <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
          <img
            src={value}
            alt="Vista previa"
            className="max-h-48 w-full object-contain"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        </div>
      )}
    </div>
  )
}
