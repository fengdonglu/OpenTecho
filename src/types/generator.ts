import type { Language, PageDimensions, PageSection, ThemeType, WeekStart } from './common'

export interface GeneratorConfig {
  year: number
  theme: ThemeType
  language: Language
  weekStart: WeekStart
  gridCount: number
  blankCount: number
  contactCount: number
  meetingCount: number
}

export interface PageMetadata {
  pageNumber: number
  dimensions: PageDimensions
}

export interface PageData {
  id: string
  section: PageSection
  title: string
  svg: string
  metadata: PageMetadata
}

export interface GeneratedDocument {
  config: GeneratorConfig
  pages: PageData[]
}
