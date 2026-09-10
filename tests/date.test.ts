import { describe, expect, it } from 'vitest'
import {
  getDaysInMonth,
  getFirstDayOfWeek,
  getWeeksOfMonth,
  getWeeksOfYear,
  isWeekend,
} from '@/utils/date'

describe('date 工具', () => {
  it('getDaysInMonth 处理闰年', () => {
    expect(getDaysInMonth(2024, 2)).toBe(29)
    expect(getDaysInMonth(2023, 2)).toBe(28)
    expect(getDaysInMonth(2024, 4)).toBe(30)
    expect(getDaysInMonth(2024, 12)).toBe(31)
  })

  it('getFirstDayOfWeek 周一起始', () => {
    expect(getFirstDayOfWeek(2024, 1, 'monday')).toBe(0) // 2024-01-01 周一
    expect(getFirstDayOfWeek(2024, 2, 'monday')).toBe(3) // 2024-02-01 周四
    expect(getFirstDayOfWeek(2023, 1, 'monday')).toBe(6) // 2023-01-01 周日
  })

  it('getFirstDayOfWeek 周日起始', () => {
    expect(getFirstDayOfWeek(2023, 1, 'sunday')).toBe(0) // 2023-01-01 周日
    expect(getFirstDayOfWeek(2024, 1, 'sunday')).toBe(1) // 2024-01-01 周一
  })

  it('isWeekend 判断周六周日', () => {
    expect(isWeekend(new Date(2024, 0, 6))).toBe(true) // 周六
    expect(isWeekend(new Date(2024, 0, 7))).toBe(true) // 周日
    expect(isWeekend(new Date(2024, 0, 5))).toBe(false) // 周五
  })

  it('getWeeksOfYear 首周跨年', () => {
    const weeks = getWeeksOfYear(2027, 'monday')
    expect(weeks[0].getFullYear()).toBe(2026)
    expect(weeks[0].getMonth()).toBe(11) // 12 月
    expect(weeks[0].getDate()).toBe(28)
  })

  it('getWeeksOfMonth 元旦落在 1 月第 1 周', () => {
    const weeks = getWeeksOfMonth(2027, 1, 'monday')
    expect(weeks.length).toBe(5)
    expect(weeks[0].getFullYear()).toBe(2026)
    expect(weeks[0].getDate()).toBe(28)
  })

  it('getWeeksOfMonth 跨年不重不漏', () => {
    const decWeeks = getWeeksOfMonth(2026, 12, 'monday')
    const lastDec = decWeeks[decWeeks.length - 1]
    expect(lastDec.getDate()).toBe(21) // 12 月最后一周周一为 12/21
    const janWeeks = getWeeksOfMonth(2027, 1, 'monday')
    expect(janWeeks[0].getDate()).toBe(28) // 12/28 归 1 月
  })
})
