import { describe, expect, it } from 'vitest'
import { generateDocument } from '@/generators/DocumentGenerator'
import type { GeneratorConfig } from '@/types'

const baseConfig: GeneratorConfig = {
  year: 2027,
  theme: 'minimal',
  language: 'zh-CN',
  weekStart: 'monday',
  gridCount: 2,
  blankCount: 2,
  contactCount: 2,
  meetingCount: 2,
}

describe('手帐文档生成', () => {
  it('首页为三年年历，次页为当年年历', () => {
    const doc = generateDocument(baseConfig)
    expect(doc.pages[0].section.kind).toBe('threeYear')
    expect(doc.pages[1].section.kind).toBe('yearly')
  })

  it('年度后是上年 Q4（10 月）', () => {
    const doc = generateDocument(baseConfig)
    const section = doc.pages[2].section
    expect(section.kind).toBe('monthly')
    expect(section.year).toBe(2026)
    expect(section.month).toBe(10)
  })

  it('月份页共 18 页（3 + 12 + 3）', () => {
    const doc = generateDocument(baseConfig)
    const monthCount = doc.pages.filter((p) => p.section.kind === 'monthly').length
    expect(monthCount).toBe(18)
  })

  it('含一页使用说明（intro）', () => {
    const doc = generateDocument(baseConfig)
    expect(doc.pages.filter((p) => p.section.kind === 'intro').length).toBe(1)
  })

  it('附录末尾为会议记录页', () => {
    const doc = generateDocument(baseConfig)
    expect(doc.pages[doc.pages.length - 1].section.kind).toBe('meeting')
  })

  it('每周起始周日时周归属正确', () => {
    const doc = generateDocument({ ...baseConfig, weekStart: 'sunday' })
    const janFirstWeek = doc.pages.find(
      (p) => p.section.kind === 'weekly' && p.section.year === 2027 && p.section.month === 1 && p.section.week === 1
    )
    expect(janFirstWeek).toBeDefined()
    // 周日起始时，1 月第 1 周含元旦
    expect(janFirstWeek?.svg).toContain('>1</text>')
  })
})
