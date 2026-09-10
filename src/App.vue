<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'
import SVGPreview from '@/components/preview/SVGPreview.vue'
import { messages } from '@/locales'
import { downloadAllSvg, downloadSvg } from '@/utils/download'
import { exportPdf } from '@/utils/pdf'
import { MAX_YEAR, MIN_YEAR, THEMES, UI_THEMES } from '@/utils/constants'
import type { ThemeType } from '@/types'

const store = useAppStore()
const {
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
  pageCount,
  currentSvg,
  currentTitle,
} = storeToRefs(store)

const collapsed = ref(
  typeof window !== 'undefined' && window.matchMedia('(max-width: 980px)').matches
)
const appendixExpanded = ref(true)

const GITHUB_URL = 'https://github.com/fengdonglu/OpenTecho.git'

const t = computed(() => messages[language.value])

const themeOptions = computed(() =>
  (Object.keys(THEMES) as ThemeType[]).map(key => ({
    key,
    label: t.value.themes[key],
    swatches: [THEMES[key].accent, THEMES[key].ink, THEMES[key].background],
  }))
)

interface MonthToc {
  key: string
  month: number
  pageIndex: number
  weeks: Array<{ week: number; pageIndex: number }>
}

interface TocGroup {
  label: string
  months: MonthToc[]
}

const tocData = computed(() => {
  const m = messages[language.value]
  const mainYear = store.year
  const groups: TocGroup[] = [
    { label: m.groupPrevYearQ4(mainYear - 1), months: [] },
    { label: m.groupCurrentYear(mainYear), months: [] },
    { label: m.groupNextYearQ1(mainYear + 1), months: [] },
  ]
  let yearlyIndex = -1
  let introIndex = -1
  let gridIndex: number | null = null
  let blankIndex: number | null = null
  let contactIndex: number | null = null
  let meetingIndex: number | null = null
  let current: MonthToc | null = null

  store.document.pages.forEach((page, index) => {
    const s = page.section
    if (s.kind === 'threeYear') {
      yearlyIndex = index
    } else if (s.kind === 'intro') {
      introIndex = index
    } else if (s.kind === 'monthly') {
      current = { key: `${s.year}-${s.month}`, month: s.month, pageIndex: index, weeks: [] }
      const groupIndex = s.year < mainYear ? 0 : s.year > mainYear ? 2 : 1
      groups[groupIndex].months.push(current)
    } else if (s.kind === 'weekly') {
      current?.weeks.push({ week: s.week, pageIndex: index })
    } else if (s.kind === 'grid' && s.index === 1) {
      gridIndex = index
    } else if (s.kind === 'blank' && s.index === 1) {
      blankIndex = index
    } else if (s.kind === 'contact' && s.index === 1) {
      contactIndex = index
    } else if (s.kind === 'meeting' && s.index === 1) {
      meetingIndex = index
    }
  })

  return { yearlyIndex, introIndex, groups, gridIndex, blankIndex, contactIndex, meetingIndex }
})

const expandedMonthKey = computed(() => {
  const page = store.document.pages[currentPage.value]
  if (page && (page.section.kind === 'monthly' || page.section.kind === 'weekly')) {
    return `${page.section.year}-${page.section.month}`
  }
  return null
})

function isExpanded(key: string): boolean {
  return expandedMonthKey.value === key
}

const uiVars = computed(() => {
  const ui = UI_THEMES[theme.value]
  return {
    '--sidebar': ui.sidebar,
    '--sidebar-text': ui.sidebarText,
    '--sidebar-muted': ui.sidebarMuted,
    '--sidebar-panel': ui.sidebarPanel,
    '--sidebar-border': ui.sidebarBorder,
    '--workspace': ui.workspace,
    '--ui-accent': ui.accent,
    '--ui-accent-text': ui.accentText,
  }
})

const pageInput = ref(1)
watch(currentPage, () => {
  pageInput.value = currentPage.value + 1
})
pageInput.value = currentPage.value + 1

function jumpToPage(): void {
  const target = Math.min(Math.max(1, pageInput.value), pageCount.value)
  store.setPage(target - 1)
  pageInput.value = target
}

function downloadCurrent(): void {
  if (!currentSvg.value) return
  const page = store.document.pages[currentPage.value]
  if (page) downloadSvg(page.svg, `OpenTecho-${year.value}-${page.title}.svg`)
}

function downloadAll(): void {
  downloadAllSvg(
    store.document.pages.map(page => ({ svg: page.svg, title: page.title })),
    `OpenTecho-${year.value}`
  )
}

const exporting = ref(false)

async function downloadPdf(): Promise<void> {
  if (exporting.value) return
  exporting.value = true
  try {
    const pages = store.document.pages.map(page => ({
      svg: page.svg,
      widthMm: page.metadata.dimensions.width,
      heightMm: page.metadata.dimensions.height,
    }))
    await exportPdf(pages, `OpenTecho-${year.value}.pdf`)
  } catch (error) {
    console.error('PDF export failed:', error)
    window.alert('PDF export failed. Please try again.')
  } finally {
    exporting.value = false
  }
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'PageDown') {
    event.preventDefault()
    store.nextPage()
  } else if (event.key === 'PageUp') {
    event.preventDefault()
    store.prevPage()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <main class="app-shell" :class="{ collapsed }" :style="uiVars">
    <aside class="control-panel">
      <div class="brand">
        <svg class="brand-logo" viewBox="0 0 200 141.42" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M50 40 L67 40"
            fill="none"
            stroke="#666"
            stroke-width="6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M133 40 L150 40 Q170 40 170 60 L170 110 Q170 130 150 130 L50 130 Q30 130 30 110 L30 60 Q30 40 50 40"
            fill="none"
            stroke="#666"
            stroke-width="6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <circle cx="67" cy="40" r="8" fill="#666" />
          <circle cx="133" cy="40" r="8" fill="#666" />
          <path
            d="M87 28.3 A13 11.7 0 0 1 113 28.3 L113 51.7 A13 11.7 0 0 1 87 51.7 L87 28.3"
            fill="none"
            stroke="#666"
            stroke-width="6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <text
            x="100"
            y="105"
            text-anchor="middle"
            dominant-baseline="middle"
            font-family="Arial, Helvetica, sans-serif"
            font-size="21.3"
            font-weight="bold"
            fill="#666"
          >
            {{ year }}
          </text>
        </svg>
        <div class="brand-text">
          <p>{{ t.appName }}</p>
          <span>{{ t.appTagline }}</span>
        </div>
        <div class="brand-meta">
          <span class="author-name">{{ t.author }}</span>
          <a class="github-link" :href="GITHUB_URL" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              />
            </svg>
            <span>{{ t.github }}</span>
          </a>
        </div>
      </div>

      <section class="panel-section">
        <div class="row">
          <span class="row-label">{{ t.year }}</span>
          <input
            v-model.number="year"
            type="number"
            :min="MIN_YEAR"
            :max="MAX_YEAR"
            class="year-input"
          />
        </div>

        <div class="row">
          <span class="row-label">{{ t.theme }}</span>
          <div class="theme-picker">
            <button
              v-for="option in themeOptions"
              :key="option.key"
              :class="{ active: theme === option.key }"
              @click="theme = option.key"
            >
              <span class="theme-preview">
                <i v-for="(c, i) in option.swatches" :key="i" :style="{ background: c }"></i>
              </span>
              <span class="theme-name">{{ option.label }}</span>
            </button>
          </div>
        </div>

        <div class="row">
          <span class="row-label">{{ t.language }}</span>
          <div class="segmented">
            <button :class="{ active: language === 'en' }" @click="language = 'en'">English</button>
            <button :class="{ active: language === 'zh-CN' }" @click="language = 'zh-CN'">
              简体
            </button>
            <button :class="{ active: language === 'zh-TW' }" @click="language = 'zh-TW'">
              繁體
            </button>
          </div>
        </div>

        <div class="row">
          <span class="row-label">{{ t.weekStart }}</span>
          <div class="segmented">
            <button :class="{ active: weekStart === 'monday' }" @click="weekStart = 'monday'">
              {{ t.weekStartMonday }}
            </button>
            <button :class="{ active: weekStart === 'sunday' }" @click="weekStart = 'sunday'">
              {{ t.weekStartSunday }}
            </button>
          </div>
        </div>
      </section>

      <section class="toc-section">
        <nav class="toc">
          <button
            class="toc-yearly"
            :class="{ active: currentPage === tocData.yearlyIndex }"
            @click="store.setPage(tocData.yearlyIndex)"
          >
            {{ t.yearLabel(year) }}
          </button>

          <template v-for="group in tocData.groups" :key="group.label">
            <div v-if="group.months.length" class="toc-group-label">{{ group.label }}</div>
            <div v-if="group.months.length" class="toc-grid">
              <template v-for="month in group.months" :key="month.key">
                <div class="toc-card">
                  <button
                    class="toc-card-header"
                    :class="{ active: currentPage === month.pageIndex }"
                    @click="store.setPage(month.pageIndex)"
                  >
                    <span>{{ t.months[month.month - 1] }}</span>
                    <span class="toc-caret">{{ isExpanded(month.key) ? '▾' : '▸' }}</span>
                  </button>
                  <div v-if="isExpanded(month.key)" class="toc-card-body">
                    <button
                      v-for="week in month.weeks"
                      :key="week.pageIndex"
                      class="week-chip"
                      :class="{ active: currentPage === week.pageIndex }"
                      @click="store.setPage(week.pageIndex)"
                    >
                      {{ t.weekLabel(week.week) }}
                    </button>
                  </div>
                </div>
              </template>
            </div>
          </template>

          <div class="toc-appendix">
            <button class="toc-appendix-toggle" @click="appendixExpanded = !appendixExpanded">
              <span class="toc-caret">{{ appendixExpanded ? '▾' : '▸' }}</span>
              <span>{{ t.appendix }}</span>
            </button>
            <div v-if="appendixExpanded" class="appendix-body">
              <div class="appendix-item">
                <span class="appendix-tag">A1</span>
                <button
                  class="appendix-link"
                  :class="{ active: currentPage === tocData.introIndex }"
                  @click="store.setPage(tocData.introIndex)"
                >
                  {{ t.intro }}
                </button>
              </div>
              <div class="appendix-item">
                <span class="appendix-tag">A2</span>
                <input
                  v-model.number="gridCount"
                  type="number"
                  min="0"
                  max="50"
                  class="appendix-count"
                />
                <span class="appendix-x">×</span>
                <button
                  class="appendix-link"
                  :class="{ active: currentPage === tocData.gridIndex }"
                  :disabled="tocData.gridIndex === null"
                  @click="tocData.gridIndex !== null && store.setPage(tocData.gridIndex)"
                >
                  {{ t.grid }}
                </button>
              </div>
              <div class="appendix-item">
                <span class="appendix-tag">A3</span>
                <input
                  v-model.number="blankCount"
                  type="number"
                  min="0"
                  max="50"
                  class="appendix-count"
                />
                <span class="appendix-x">×</span>
                <button
                  class="appendix-link"
                  :class="{ active: currentPage === tocData.blankIndex }"
                  :disabled="tocData.blankIndex === null"
                  @click="tocData.blankIndex !== null && store.setPage(tocData.blankIndex)"
                >
                  {{ t.blank }}
                </button>
              </div>
              <div class="appendix-item">
                <span class="appendix-tag">A4</span>
                <input
                  v-model.number="contactCount"
                  type="number"
                  min="0"
                  max="50"
                  class="appendix-count"
                />
                <span class="appendix-x">×</span>
                <button
                  class="appendix-link"
                  :class="{ active: currentPage === tocData.contactIndex }"
                  :disabled="tocData.contactIndex === null"
                  @click="tocData.contactIndex !== null && store.setPage(tocData.contactIndex)"
                >
                  {{ t.contact }}
                </button>
              </div>
              <div class="appendix-item">
                <span class="appendix-tag">A5</span>
                <input
                  v-model.number="meetingCount"
                  type="number"
                  min="0"
                  max="50"
                  class="appendix-count"
                />
                <span class="appendix-x">×</span>
                <button
                  class="appendix-link"
                  :class="{ active: currentPage === tocData.meetingIndex }"
                  :disabled="tocData.meetingIndex === null"
                  @click="tocData.meetingIndex !== null && store.setPage(tocData.meetingIndex)"
                >
                  {{ t.meeting }}
                </button>
              </div>
            </div>
          </div>
        </nav>
      </section>
    </aside>

    <section class="workspace">
      <header class="topbar">
        <div class="topbar-left">
          <button
            class="collapse-button"
            :title="collapsed ? t.expand : t.collapse"
            @click="collapsed = !collapsed"
          >
            ☰
          </button>
          <div>
            <p>{{ t.appName }} · {{ year }}</p>
            <h1>{{ currentTitle }}</h1>
          </div>
        </div>
        <div class="actions">
          <button class="action-button" :disabled="currentPage <= 0" @click="store.prevPage()">
            {{ t.prevPage }}
          </button>
          <span class="page-indicator">
            <input
              v-model.number="pageInput"
              type="number"
              :min="1"
              :max="pageCount"
              class="page-input"
              @change="jumpToPage"
              @keyup.enter="jumpToPage"
            />
            / {{ pageCount }}
          </span>
          <button
            class="action-button"
            :disabled="currentPage >= pageCount - 1"
            @click="store.nextPage()"
          >
            {{ t.nextPage }}
          </button>
          <button class="action-button" :disabled="!currentSvg" @click="downloadCurrent()">
            {{ t.downloadCurrent }}
          </button>
          <button class="action-button" @click="downloadAll()">{{ t.downloadAll }}</button>
          <button class="action-button" :disabled="exporting" @click="downloadPdf()">
            {{ exporting ? '…' : t.exportPdf }}
          </button>
          <label class="download-theme">
            <input v-model="useThemeForDownload" type="checkbox" />
            {{ t.useTheme }}
          </label>
        </div>
      </header>

      <div class="preview-band">
        <SVGPreview :svg="currentSvg" />
      </div>
    </section>
  </main>
</template>
