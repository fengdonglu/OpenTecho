import { messages } from '@/locales'
import {
  blankBody,
  contactBody,
  gridBody,
  introBody,
  meetingBody,
  monthlyBody,
  threeYearBody,
  weeklyBody,
  yearlyBody,
} from '@/templates'
import { B6_DIMENSIONS, SPREAD_DIMENSIONS, THEMES } from '@/utils/constants'
import { getWeeksOfMonth } from '@/utils/date'
import { svgDocument } from '@/utils/svg'
import type {
  GeneratedDocument,
  GeneratorConfig,
  Language,
  PageData,
  PageSection,
  ThemeConfig,
} from '@/types'

function monthText(year: number, month: number, mainYear: number, language: Language): string {
  const label = messages[language].months[month - 1]
  if (year === mainYear) return label
  return language === 'en' ? `${label} ${year}` : `${year}年${label}`
}

function sectionTitle(section: PageSection, mainYear: number, language: Language): string {
  const m = messages[language]
  switch (section.kind) {
    case 'threeYear':
      return m.threeYear
    case 'yearly':
      return m.currentYear
    case 'monthly':
      return monthText(section.year, section.month, mainYear, language)
    case 'weekly':
      return `${monthText(section.year, section.month, mainYear, language)} · ${m.weekLabel(section.week)}`
    case 'intro':
      return m.intro
    case 'grid':
      return `${m.grid} ${section.index}`
    case 'blank':
      return `${m.blank} ${section.index}`
    case 'contact':
      return `${m.contact} ${section.index}`
    case 'meeting':
      return `${m.meeting} ${section.index}`
  }
}

function sectionId(section: PageSection): string {
  switch (section.kind) {
    case 'threeYear':
      return 'three-year'
    case 'yearly':
      return 'yearly'
    case 'monthly':
      return `monthly-${section.year}-${section.month}`
    case 'weekly':
      return `weekly-${section.year}-${section.month}-${section.week}`
    case 'intro':
      return 'intro'
    case 'grid':
      return `grid-${section.index}`
    case 'blank':
      return `blank-${section.index}`
    case 'contact':
      return `contact-${section.index}`
    case 'meeting':
      return `meeting-${section.index}`
  }
}

function pushMonth(
  pages: PageData[],
  theme: ThemeConfig,
  config: GeneratorConfig,
  year: number,
  month: number
): void {
  const monthly: PageSection = { kind: 'monthly', year, month }
  pages.push({
    id: sectionId(monthly),
    section: monthly,
    title: sectionTitle(monthly, config.year, config.language),
    svg: svgDocument(
      SPREAD_DIMENSIONS,
      theme,
      monthlyBody(year, month, theme, config.language, config.weekStart)
    ),
    metadata: { pageNumber: pages.length + 1, dimensions: SPREAD_DIMENSIONS },
  })

  getWeeksOfMonth(year, month, config.weekStart).forEach((monday, index) => {
    const weekly: PageSection = { kind: 'weekly', year, month, week: index + 1 }
    pages.push({
      id: sectionId(weekly),
      section: weekly,
      title: sectionTitle(weekly, config.year, config.language),
      svg: svgDocument(
        SPREAD_DIMENSIONS,
        theme,
        weeklyBody(monday, theme, config.language, config.weekStart, config.year)
      ),
      metadata: { pageNumber: pages.length + 1, dimensions: SPREAD_DIMENSIONS },
    })
  })
}

export function generateDocument(config: GeneratorConfig): GeneratedDocument {
  const theme: ThemeConfig = THEMES[config.theme] ?? THEMES.minimal
  const mainYear = config.year
  const pages: PageData[] = []

  const threeYear: PageSection = { kind: 'threeYear' }
  pages.push({
    id: sectionId(threeYear),
    section: threeYear,
    title: sectionTitle(threeYear, mainYear, config.language),
    svg: svgDocument(
      SPREAD_DIMENSIONS,
      theme,
      threeYearBody(mainYear, theme, config.language, config.weekStart)
    ),
    metadata: { pageNumber: 1, dimensions: SPREAD_DIMENSIONS },
  })

  const yearly: PageSection = { kind: 'yearly' }
  pages.push({
    id: sectionId(yearly),
    section: yearly,
    title: sectionTitle(yearly, mainYear, config.language),
    svg: svgDocument(
      SPREAD_DIMENSIONS,
      theme,
      yearlyBody(mainYear, theme, config.language, config.weekStart)
    ),
    metadata: { pageNumber: pages.length + 1, dimensions: SPREAD_DIMENSIONS },
  })

  for (const month of [10, 11, 12]) {
    pushMonth(pages, theme, config, mainYear - 1, month)
  }
  for (let month = 1; month <= 12; month++) {
    pushMonth(pages, theme, config, mainYear, month)
  }
  for (const month of [1, 2, 3]) {
    pushMonth(pages, theme, config, mainYear + 1, month)
  }

  const intro: PageSection = { kind: 'intro' }
  pages.push({
    id: sectionId(intro),
    section: intro,
    title: sectionTitle(intro, mainYear, config.language),
    svg: svgDocument(B6_DIMENSIONS, theme, introBody(B6_DIMENSIONS, theme, config.language)),
    metadata: { pageNumber: pages.length + 1, dimensions: B6_DIMENSIONS },
  })

  for (let index = 1; index <= config.gridCount; index++) {
    const section: PageSection = { kind: 'grid', index }
    pages.push({
      id: sectionId(section),
      section,
      title: sectionTitle(section, mainYear, config.language),
      svg: svgDocument(B6_DIMENSIONS, theme, gridBody(B6_DIMENSIONS, theme)),
      metadata: { pageNumber: pages.length + 1, dimensions: B6_DIMENSIONS },
    })
  }
  for (let index = 1; index <= config.blankCount; index++) {
    const section: PageSection = { kind: 'blank', index }
    pages.push({
      id: sectionId(section),
      section,
      title: sectionTitle(section, mainYear, config.language),
      svg: svgDocument(B6_DIMENSIONS, theme, blankBody(B6_DIMENSIONS, theme)),
      metadata: { pageNumber: pages.length + 1, dimensions: B6_DIMENSIONS },
    })
  }
  for (let index = 1; index <= config.contactCount; index++) {
    const section: PageSection = { kind: 'contact', index }
    pages.push({
      id: sectionId(section),
      section,
      title: sectionTitle(section, mainYear, config.language),
      svg: svgDocument(
        B6_DIMENSIONS,
        theme,
        contactBody(B6_DIMENSIONS, theme, config.language)
      ),
      metadata: { pageNumber: pages.length + 1, dimensions: B6_DIMENSIONS },
    })
  }
  for (let index = 1; index <= config.meetingCount; index++) {
    const section: PageSection = { kind: 'meeting', index }
    pages.push({
      id: sectionId(section),
      section,
      title: sectionTitle(section, mainYear, config.language),
      svg: svgDocument(
        B6_DIMENSIONS,
        theme,
        meetingBody(B6_DIMENSIONS, theme, config.language)
      ),
      metadata: { pageNumber: pages.length + 1, dimensions: B6_DIMENSIONS },
    })
  }

  return { config, pages }
}
