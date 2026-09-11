import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { GeneratorConfig } from '@/types'

vi.mock('@/templates', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/templates')>()
  return { ...actual, monthlyBody: vi.fn(actual.monthlyBody) }
})

import { generateDocument } from '@/generators/DocumentGenerator'
import { monthlyBody } from '@/templates'

const config: GeneratorConfig = {
  year: 2027,
  theme: 'minimal',
  language: 'en',
  weekStart: 'monday',
  gridCount: 1,
  blankCount: 1,
  contactCount: 1,
  meetingCount: 1,
}

describe('按需渲染', () => {
  beforeEach(() => {
    vi.mocked(monthlyBody).mockClear()
  })

  it('构建文档时不渲染月历，访问 svg 时才渲染', () => {
    const doc = generateDocument(config)
    expect(monthlyBody).not.toHaveBeenCalled()

    const monthly = doc.pages.find((p) => p.section.kind === 'monthly')
    expect(monthly).toBeDefined()
    void monthly!.svg

    expect(monthlyBody).toHaveBeenCalledTimes(1)
  })

  it('同一页重复访问只渲染一次（记忆化）', () => {
    const doc = generateDocument(config)
    const monthly = doc.pages.find((p) => p.section.kind === 'monthly')!

    const first = monthly.svg
    const second = monthly.svg

    expect(first).toBe(second)
    expect(monthlyBody).toHaveBeenCalledTimes(1)
  })
})
