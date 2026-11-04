import rawDefaults from '../../backend/content/default-content.json'
import type { CmsData, CmsVersions, SectionKey } from './types'

export const DEFAULT_DATA = rawDefaults as unknown as CmsData

export const SECTION_KEYS = Object.keys(DEFAULT_DATA) as SectionKey[]

export const DEFAULT_VERSIONS = Object.fromEntries(
  SECTION_KEYS.map((key) => [key, 0]),
) as CmsVersions
