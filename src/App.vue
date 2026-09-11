<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'
import AppSidebar from '@/components/sidebar/AppSidebar.vue'
import SVGPreview from '@/components/preview/SVGPreview.vue'
import { messages } from '@/locales'
import { downloadAllSvg, downloadSvg } from '@/utils/download'
import { exportPdf } from '@/utils/pdf'
import { UI_THEMES } from '@/utils/constants'
import { useInstallPrompt } from '@/composables/useInstallPrompt'

const store = useAppStore()
const { canInstall, promptInstall } = useInstallPrompt()
const {
  year,
  theme,
  language,
  useThemeForDownload,
  currentPage,
  pageCount,
  currentSvg,
  currentTitle,
} = storeToRefs(store)

const collapsed = ref(
  typeof window !== 'undefined' && window.matchMedia('(max-width: 980px)').matches
)

const t = computed(() => messages[language.value])

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
const exportProgress = ref({ done: 0, total: 0 })
let abortController: AbortController | null = null

function cancelPdf(): void {
  abortController?.abort()
}

async function downloadPdf(): Promise<void> {
  if (exporting.value) return
  exporting.value = true
  exportProgress.value = { done: 0, total: 0 }
  abortController = new AbortController()
  try {
    const pages = store.document.pages.map(page => ({
      svg: page.svg,
      widthMm: page.metadata.dimensions.width,
      heightMm: page.metadata.dimensions.height,
    }))
    await exportPdf(pages, `OpenTecho-${year.value}.pdf`, {
      signal: abortController.signal,
      onProgress: (done, total) => {
        exportProgress.value = { done, total }
      },
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      // 用户主动取消，无需提示
    } else {
      console.error('PDF export failed:', error)
      window.alert(t.value.pdfFailed)
    }
  } finally {
    exporting.value = false
    abortController = null
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
    <AppSidebar />

    <section class="workspace">
      <header class="topbar">
        <div class="topbar-left">
          <button
            class="collapse-button"
            :title="collapsed ? t.expand : t.collapse"
            :aria-label="collapsed ? t.expand : t.collapse"
            :aria-expanded="!collapsed"
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
          <button v-if="canInstall" class="action-button install-button" @click="promptInstall()">
            {{ t.install }}
          </button>
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
            {{ exporting ? `${exportProgress.done}/${exportProgress.total}` : t.exportPdf }}
          </button>
          <button v-if="exporting" class="action-button" @click="cancelPdf()">
            {{ t.cancel }}
          </button>
          <label class="download-theme">
            <input v-model="useThemeForDownload" type="checkbox" />
            {{ t.useTheme }}
          </label>
        </div>
      </header>

      <div class="preview-band">
        <SVGPreview :svg="currentSvg" :alt="t.preview" :empty-text="t.previewEmpty" />
      </div>
    </section>
  </main>
</template>
