import type { Language } from '@/types'
import { solarToLunar, type LunarDate } from './lunar'

export type HolidayType = 'legal' | 'folk' | 'western'

export interface Holiday {
  name: string
  short: string
  tw: string
  en: string
  enShort: string
  type: HolidayType
  /** 国际通用节日（元旦/劳动节/妇女节/儿童节等），英文版也会显示 */
  universal?: boolean
}

const SOLAR_HOLIDAYS: Record<string, Holiday[]> = {
  '1-1': [{ name: '元旦', short: '元旦', tw: '元旦', en: "New Year's Day", enShort: 'New Year', type: 'legal', universal: true }],
  '2-14': [{ name: '情人节', short: '情人', tw: '情人', en: "Valentine's Day", enShort: 'Valentine', type: 'folk' }],
  '3-8': [{ name: '妇女节', short: '妇女', tw: '婦女', en: "Women's Day", enShort: "Women's", type: 'folk', universal: true }],
  '3-12': [{ name: '植树节', short: '植树', tw: '植樹', en: 'Arbor Day', enShort: 'Arbor', type: 'folk' }],
  '4-5': [{ name: '清明节', short: '清明', tw: '清明', en: 'Qingming', enShort: 'Qingming', type: 'legal' }],
  '5-1': [{ name: '劳动节', short: '劳动', tw: '勞動', en: 'Labor Day', enShort: 'Labor Day', type: 'legal', universal: true }],
  '5-4': [{ name: '青年节', short: '青年', tw: '青年', en: 'Youth Day', enShort: 'Youth', type: 'folk' }],
  '6-1': [{ name: '儿童节', short: '儿童', tw: '兒童', en: "Children's Day", enShort: 'Children', type: 'folk', universal: true }],
  '7-1': [{ name: '建党节', short: '建党', tw: '建黨', en: 'CPC Founding Day', enShort: 'CPC Day', type: 'folk' }],
  '8-1': [{ name: '建军节', short: '建军', tw: '建軍', en: 'Army Day', enShort: 'Army Day', type: 'folk' }],
  '9-10': [{ name: '教师节', short: '教师', tw: '教師', en: "Teachers' Day", enShort: 'Teachers', type: 'folk' }],
  '10-1': [{ name: '国庆节', short: '国庆', tw: '國慶', en: 'National Day', enShort: 'National', type: 'legal' }],
  '12-24': [{ name: '平安夜', short: '平安', tw: '平安', en: 'Christmas Eve', enShort: 'Xmas Eve', type: 'folk' }],
  '12-25': [{ name: '圣诞节', short: '圣诞', tw: '聖誕', en: 'Christmas', enShort: 'Christmas', type: 'folk' }],
}

const LUNAR_HOLIDAYS: Record<string, Holiday[]> = {
  '1-1': [{ name: '春节', short: '春节', tw: '春節', en: 'Spring Festival', enShort: 'Spring F.', type: 'legal' }],
  '1-15': [{ name: '元宵节', short: '元宵', tw: '元宵', en: 'Lantern Festival', enShort: 'Lantern', type: 'folk' }],
  '2-2': [{ name: '龙抬头', short: '龙抬头', tw: '龍抬頭', en: 'Dragon Head Day', enShort: 'Dragon H.', type: 'folk' }],
  '5-5': [{ name: '端午节', short: '端午', tw: '端午', en: 'Dragon Boat', enShort: 'Dragon B.', type: 'legal' }],
  '7-7': [{ name: '七夕节', short: '七夕', tw: '七夕', en: 'Qixi Festival', enShort: 'Qixi', type: 'folk' }],
  '7-15': [{ name: '中元节', short: '中元', tw: '中元', en: 'Zhongyuan', enShort: 'Zhongyuan', type: 'folk' }],
  '8-15': [{ name: '中秋节', short: '中秋', tw: '中秋', en: 'Mid-Autumn', enShort: 'Mid-Aut.', type: 'legal' }],
  '9-9': [{ name: '重阳节', short: '重阳', tw: '重陽', en: 'Double Ninth', enShort: 'Double 9', type: 'folk' }],
  '12-8': [{ name: '腊八节', short: '腊八', tw: '臘八', en: 'Laba Festival', enShort: 'Laba', type: 'folk' }],
  '12-23': [{ name: '小年', short: '小年', tw: '小年', en: 'Little New Year', enShort: 'Xiaonian', type: 'folk' }],
  '12-30': [{ name: '除夕', short: '除夕', tw: '除夕', en: "New Year's Eve", enShort: 'NY Eve', type: 'legal' }],
}

// 西方常见节假日（美国为准，排除美国特有节日如独立日/阵亡将士纪念日）
const WESTERN_FIXED: Record<string, Holiday> = {
  '2-14': { name: '情人节', short: '情人', tw: '情人', en: "Valentine's Day", enShort: 'Valentine', type: 'western' },
  '3-17': { name: '圣帕特里克节', short: '圣帕特', tw: '聖帕特', en: "St. Patrick's Day", enShort: 'St. Pat', type: 'western' },
  '4-1': { name: '愚人节', short: '愚人', tw: '愚人', en: "April Fools' Day", enShort: 'April Fools', type: 'western' },
  '10-31': { name: '万圣节', short: '万圣', tw: '萬聖', en: 'Halloween', enShort: 'Halloween', type: 'western' },
  '12-24': { name: '平安夜', short: '平安', tw: '平安', en: 'Christmas Eve', enShort: 'Xmas Eve', type: 'western' },
  '12-25': { name: '圣诞节', short: '圣诞', tw: '聖誕', en: 'Christmas', enShort: 'Christmas', type: 'western' },
}

function getEaster(year: number): { month: number; day: number } {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return { month, day }
}

function nthWeekday(year: number, month: number, weekday: number, n: number): number {
  const first = new Date(year, month - 1, 1)
  let day = 1 + ((weekday - first.getDay() + 7) % 7)
  day += (n - 1) * 7
  return day
}

function getWesternDynamic(date: Date): Holiday | null {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  const easter = getEaster(y)
  if (m === easter.month && d === easter.day)
    return { name: '复活节', short: '复活', tw: '復活', en: 'Easter', enShort: 'Easter', type: 'western' }
  if (m === 5 && d === nthWeekday(y, 5, 0, 2))
    return { name: '母亲节', short: '母亲', tw: '母親', en: "Mother's Day", enShort: 'Mothers', type: 'western' }
  if (m === 6 && d === nthWeekday(y, 6, 0, 3))
    return { name: '父亲节', short: '父亲', tw: '父親', en: "Father's Day", enShort: 'Fathers', type: 'western' }
  if (m === 11 && d === nthWeekday(y, 11, 4, 4))
    return { name: '感恩节', short: '感恩', tw: '感恩', en: 'Thanksgiving', enShort: 'Thanks', type: 'western' }
  return null
}

export function getSolarHolidays(month: number, day: number): Holiday[] {
  return SOLAR_HOLIDAYS[`${month}-${day}`] ?? []
}

export function getLunarHolidays(month: number, day: number): Holiday[] {
  return LUNAR_HOLIDAYS[`${month}-${day}`] ?? []
}

/** 综合某日的所有节假日（中国 + 西方，含变动节日），按日期。 */
export function getHolidaysOfDate(date: Date): Holiday[] {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const lunar = solarToLunar(date)
  const solar = getSolarHolidays(month, day)
  const lunarH = getLunarHolidays(lunar.month, lunar.day)
  const westernFixedKey = `${month}-${day}`
  const westernFixed = WESTERN_FIXED[westernFixedKey]
  const westernDynamic = getWesternDynamic(date)
  return [...solar, ...lunarH, ...(westernFixed ? [westernFixed] : []), ...(westernDynamic ? [westernDynamic] : [])]
}

/** 按语言返回该日应显示的节假日：英文版显示西方节日 + 国际通用节日（元旦/劳动节/妇女节/儿童节），
 *  隐藏纯中国民俗节日（元宵/端午/中秋/重阳/腊八/小年等）；中文版（简/繁）显示全部。 */
export function getHolidaysForLanguage(language: Language, date: Date): Holiday[] {
  const all = getHolidaysOfDate(date)
  if (language === 'en') return all.filter((h) => h.type === 'western' || h.universal)
  return all
}

/** 中国法定节假日（红色背景），仅在简体中文版应用。含春节初一至初三、国庆三天。 */
export function isLegalHolidayCn(date: Date, lunar: LunarDate): boolean {
  const m = date.getMonth() + 1
  const d = date.getDate()
  if (m === 1 && d === 1) return true
  if (m === 5 && d === 1) return true
  if (m === 10 && d >= 1 && d <= 3) return true
  if (lunar.jieqi === '清明') return true
  if (lunar.month === 1 && lunar.day >= 1 && lunar.day <= 3) return true
  if (lunar.month === 5 && lunar.day === 5) return true
  if (lunar.month === 8 && lunar.day === 15) return true
  return false
}

export function holidayLabel(holiday: Holiday, language: Language): string {
  if (language === 'en') return holiday.enShort
  if (language === 'zh-TW') return holiday.tw
  return holiday.short
}
