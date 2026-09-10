import { describe, expect, it } from 'vitest'
import { getLunarHolidays, getSolarHolidays, holidayLabel } from '@/utils/holiday'

describe('节日', () => {
  it('公历元旦', () => {
    expect(getSolarHolidays(1, 1)[0].name).toBe('元旦')
  })

  it('公历国庆', () => {
    expect(getSolarHolidays(10, 1)[0].name).toBe('国庆节')
  })

  it('农历春节', () => {
    expect(getLunarHolidays(1, 1)[0].name).toBe('春节')
  })

  it('农历中秋', () => {
    expect(getLunarHolidays(8, 15)[0].name).toBe('中秋节')
  })

  it('holidayLabel 按语言', () => {
    const h = getSolarHolidays(1, 1)[0]
    expect(holidayLabel(h, 'zh-CN')).toBe('元旦')
    expect(holidayLabel(h, 'zh-TW')).toBe('元旦')
    expect(holidayLabel(h, 'en')).toBe('New Year')
  })
})
