import { describe, expect, it } from 'vitest'
import { loadSettings, saveSettings } from '@/utils/persistence'
import type { PersistedSettings, StorageLike } from '@/utils/persistence'

function fakeStorage(): StorageLike & { raw: Map<string, string> } {
  const raw = new Map<string, string>()
  return {
    raw,
    getItem: (key: string) => raw.get(key) ?? null,
    setItem: (key: string, value: string) => {
      raw.set(key, value)
    },
  }
}

const full: PersistedSettings = {
  year: 2030,
  theme: 'sakura',
  language: 'zh-TW',
  weekStart: 'sunday',
  gridCount: 3,
  blankCount: 1,
  contactCount: 0,
  meetingCount: 4,
  useThemeForDownload: false,
}

describe('设置持久化', () => {
  it('保存后可原样读回', () => {
    const storage = fakeStorage()
    saveSettings(storage, full)
    expect(loadSettings(storage)).toEqual(full)
  })

  it('无数据时返回空对象', () => {
    expect(loadSettings(fakeStorage())).toEqual({})
  })

  it('忽略非法值', () => {
    const storage = fakeStorage()
    storage.setItem(
      'opentecho:settings',
      JSON.stringify({
        year: 99999,
        theme: 'nope',
        language: 'xx',
        weekStart: 'friday',
        gridCount: -3,
        blankCount: 999,
      })
    )
    expect(loadSettings(storage)).toEqual({})
  })

  it('只保留合法字段', () => {
    const storage = fakeStorage()
    storage.setItem(
      'opentecho:settings',
      JSON.stringify({ year: 2028, theme: 'grape', language: 'en', bogus: 1 })
    )
    expect(loadSettings(storage)).toEqual({ year: 2028, theme: 'grape', language: 'en' })
  })

  it('损坏的 JSON 返回空对象', () => {
    const storage = fakeStorage()
    storage.setItem('opentecho:settings', '{not json')
    expect(loadSettings(storage)).toEqual({})
  })
})
