import { describe, expect, it } from 'vitest'
import { solarToLunar } from '@/utils/lunar'

describe('农历转换', () => {
  it('春节 2024-02-10 正月初一', () => {
    const l = solarToLunar(new Date(2024, 1, 10))
    expect(l.month).toBe(1)
    expect(l.day).toBe(1)
    expect(l.ganzhi).toBe('甲辰')
    expect(l.zodiac).toBe('龙')
  })

  it('中秋 2024-09-17 八月十五', () => {
    const l = solarToLunar(new Date(2024, 8, 17))
    expect(l.month).toBe(8)
    expect(l.day).toBe(15)
  })

  it('除夕 2024-02-09 腊月三十', () => {
    const l = solarToLunar(new Date(2024, 1, 9))
    expect(l.month).toBe(12)
    expect(l.day).toBe(30)
  })

  it('端午 2024-06-10 五月初五', () => {
    const l = solarToLunar(new Date(2024, 5, 10))
    expect(l.month).toBe(5)
    expect(l.day).toBe(5)
  })
})
