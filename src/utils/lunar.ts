import { Solar } from 'lunar-javascript'

export interface LunarDate {
  year: number
  month: number
  day: number
  isLeap: boolean
  monthName: string
  dayName: string
  ganzhi: string
  zodiac: string
  jieqi: string
}

export const LUNAR_MONTH_NUM = [
  '正',
  '二',
  '三',
  '四',
  '五',
  '六',
  '七',
  '八',
  '九',
  '十',
  '十一',
  '十二',
]

export const LUNAR_DAYS = [
  '初一',
  '初二',
  '初三',
  '初四',
  '初五',
  '初六',
  '初七',
  '初八',
  '初九',
  '初十',
  '十一',
  '十二',
  '十三',
  '十四',
  '十五',
  '十六',
  '十七',
  '十八',
  '十九',
  '二十',
  '廿一',
  '廿二',
  '廿三',
  '廿四',
  '廿五',
  '廿六',
  '廿七',
  '廿八',
  '廿九',
  '三十',
]

export function solarToLunar(date: Date): LunarDate {
  const lunar = Solar.fromDate(date).getLunar()
  const month = Math.abs(lunar.getMonth())
  return {
    year: lunar.getYear(),
    month,
    day: lunar.getDay(),
    isLeap: lunar.getMonth() < 0,
    monthName: lunar.getMonthInChinese() + '月',
    dayName: lunar.getDayInChinese(),
    ganzhi: lunar.getYearInGanZhi(),
    zodiac: lunar.getYearShengXiao(),
    jieqi: lunar.getJieQi() || '',
  }
}
