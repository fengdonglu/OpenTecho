import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { useAppStore } from '@/stores/app'

function fakeLocalStorage() {
  const raw = new Map<string, string>()
  return {
    getItem: (key: string) => raw.get(key) ?? null,
    setItem: (key: string, value: string) => {
      raw.set(key, value)
    },
    removeItem: (key: string) => {
      raw.delete(key)
    },
  }
}

describe('useAppStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('页数减少时把 currentPage 夹回有效范围', async () => {
    const store = useAppStore()

    store.meetingCount = 3
    store.setPage(store.pageCount - 1)
    const before = store.pageCount
    expect(store.currentPage).toBe(before - 1)

    store.meetingCount = 0
    await nextTick()

    expect(store.pageCount).toBeLessThan(before)
    expect(store.currentPage).toBeLessThan(store.pageCount)
    expect(store.currentSvg).not.toBe('')
  })

  it('设置写入本地并在新实例中恢复', async () => {
    vi.stubGlobal('localStorage', fakeLocalStorage())

    const first = useAppStore()
    first.theme = 'grape'
    first.language = 'zh-TW'
    first.gridCount = 5
    await nextTick()

    setActivePinia(createPinia())
    const second = useAppStore()

    expect(second.theme).toBe('grape')
    expect(second.language).toBe('zh-TW')
    expect(second.gridCount).toBe(5)
  })
})
