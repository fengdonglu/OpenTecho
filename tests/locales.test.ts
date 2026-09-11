import { describe, expect, it } from 'vitest'
import { messages } from '@/locales'
import type { Language } from '@/types'

const languages: Language[] = ['zh-CN', 'zh-TW', 'en']

describe('本地化文案', () => {
  it('各语言的键集合一致', () => {
    const base = Object.keys(messages['zh-CN']).sort()
    for (const language of languages) {
      expect(Object.keys(messages[language]).sort()).toEqual(base)
    }
  })

  it('提供预览 alt 与导出失败的文案', () => {
    for (const language of languages) {
      expect(messages[language].preview).toBeTruthy()
      expect(messages[language].previewEmpty).toBeTruthy()
      expect(messages[language].pdfFailed).toBeTruthy()
    }
  })
})
