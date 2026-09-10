import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { generateDocument } from '@/generators/DocumentGenerator'
import { getWeeksOfMonth } from '@/utils/date'
import { getDefaultYear } from '@/utils/constants'
import type {
  GeneratedDocument,
  GeneratorConfig,
  Language,
  PageData,
  ThemeType,
  WeekStart,
} from '@/types'

function getWeekStart(date: Date, weekStart: WeekStart): Date {
  const d = new Date(date)
  const dow = d.getDay()
  const diff = weekStart === 'sunday' ? -dow : dow === 0 ? -6 : 1 - dow
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function computeInitialIndex(pages: PageData[], weekStart: WeekStart): number {
  const now = new Date()
  const start = getWeekStart(now, weekStart)
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const weeks = getWeeksOfMonth(year, month, weekStart)
  const weekIndex = weeks.findIndex(m => m.getTime() === start.getTime())
  if (weekIndex >= 0) {
    const index = pages.findIndex(
      p =>
        p.section.kind === 'weekly' &&
        p.section.year === year &&
        p.section.month === month &&
        p.section.week === weekIndex + 1
    )
    if (index >= 0) return index
  }
  return 0
}

export const useAppStore = defineStore('app', () => {
  const year = ref(getDefaultYear())
  const theme = ref<ThemeType>('minimal')
  const language = ref<Language>('en')
  const weekStart = ref<WeekStart>('monday')
  const gridCount = ref(6)
  const blankCount = ref(4)
  const contactCount = ref(2)
  const meetingCount = ref(2)
  const useThemeForDownload = ref(true)
  const currentPage = ref(0)

  const effectiveTheme = computed<ThemeType>(() =>
    useThemeForDownload.value ? theme.value : 'minimal'
  )

  const config = computed<GeneratorConfig>(() => ({
    year: year.value,
    theme: effectiveTheme.value,
    language: language.value,
    weekStart: weekStart.value,
    gridCount: gridCount.value,
    blankCount: blankCount.value,
    contactCount: contactCount.value,
    meetingCount: meetingCount.value,
  }))

  const document = computed<GeneratedDocument>(() => generateDocument(config.value))

  const pageCount = computed<number>(() => document.value.pages.length)

  const currentSvg = computed<string>(() => document.value.pages[currentPage.value]?.svg ?? '')

  const currentTitle = computed<string>(() => document.value.pages[currentPage.value]?.title ?? '')

  currentPage.value = computeInitialIndex(document.value.pages, weekStart.value)

  watch([year, weekStart], () => {
    currentPage.value = computeInitialIndex(document.value.pages, weekStart.value)
  })

  function setPage(index: number): void {
    if (index >= 0 && index < document.value.pages.length) {
      currentPage.value = index
    }
  }

  function nextPage(): void {
    if (currentPage.value < pageCount.value - 1) currentPage.value++
  }

  function prevPage(): void {
    if (currentPage.value > 0) currentPage.value--
  }

  return {
    year,
    theme,
    language,
    weekStart,
    gridCount,
    blankCount,
    contactCount,
    meetingCount,
    useThemeForDownload,
    currentPage,
    config,
    document,
    pageCount,
    currentSvg,
    currentTitle,
    setPage,
    nextPage,
    prevPage,
  }
})
