export type ThemeType =
  | 'minimal'
  | 'sakura'
  | 'milktea'
  | 'lemon'
  | 'matcha'
  | 'cyan'
  | 'indigo'
  | 'grape'

export type TemplateType = 'yearly' | 'monthly' | 'weekly' | 'grid' | 'blank' | 'contact' | 'meeting'

export type Language = 'zh-CN' | 'zh-TW' | 'en'

export type WeekStart = 'monday' | 'sunday'

export interface PageDimensions {
  width: number
  height: number
  unit: 'mm'
}

export interface ThemeConfig {
  ink: string
  muted: string
  accent: string
  line: string
  hair: string
  background: string
  gridDotColor: string
  gridDotOpacity: number
  gridMidColor: string
  gridMidOpacity: number
  gridMidWidth: number
  gridMajorColor: string
  gridMajorOpacity: number
  gridMajorWidth: number
}

export type PageSection =
  | { kind: 'threeYear' }
  | { kind: 'yearly' }
  | { kind: 'monthly'; year: number; month: number }
  | { kind: 'weekly'; year: number; month: number; week: number }
  | { kind: 'intro' }
  | { kind: 'grid'; index: number }
  | { kind: 'blank'; index: number }
  | { kind: 'contact'; index: number }
  | { kind: 'meeting'; index: number }
