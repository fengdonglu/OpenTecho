import { MAX_YEAR, MIN_YEAR, THEMES } from '@/utils/constants'
import type { Language, ThemeType, WeekStart } from '@/types'

export interface PersistedSettings {
  year: number
  theme: ThemeType
  language: Language
  weekStart: WeekStart
  gridCount: number
  blankCount: number
  contactCount: number
  meetingCount: number
  useThemeForDownload: boolean
}

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

const STORAGE_KEY = 'opentecho:settings'
const LANGUAGES: Language[] = ['zh-CN', 'zh-TW', 'en']
const WEEK_STARTS: WeekStart[] = ['monday', 'sunday']
const COUNT_KEYS = ['gridCount', 'blankCount', 'contactCount', 'meetingCount'] as const

function isYear(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= MIN_YEAR && value <= MAX_YEAR
}

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 50
}

export function loadSettings(storage: StorageLike): Partial<PersistedSettings> {
  let parsed: unknown
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (!raw) return {}
    parsed = JSON.parse(raw)
  } catch {
    return {}
  }
  if (typeof parsed !== 'object' || parsed === null) return {}

  const data = parsed as Record<string, unknown>
  const result: Partial<PersistedSettings> = {}

  if (isYear(data.year)) result.year = data.year
  if (typeof data.theme === 'string' && data.theme in THEMES) {
    result.theme = data.theme as ThemeType
  }
  if (typeof data.language === 'string' && LANGUAGES.includes(data.language as Language)) {
    result.language = data.language as Language
  }
  if (typeof data.weekStart === 'string' && WEEK_STARTS.includes(data.weekStart as WeekStart)) {
    result.weekStart = data.weekStart as WeekStart
  }
  for (const key of COUNT_KEYS) {
    if (isCount(data[key])) result[key] = data[key] as number
  }
  if (typeof data.useThemeForDownload === 'boolean') {
    result.useThemeForDownload = data.useThemeForDownload
  }

  return result
}

export function saveSettings(storage: StorageLike, settings: PersistedSettings): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // 隐私模式或配额不足时静默忽略
  }
}
