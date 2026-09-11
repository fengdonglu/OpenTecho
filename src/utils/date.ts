import { MAX_YEAR, MIN_YEAR } from './constants'

export type WeekStart = 'monday' | 'sunday'

export interface CalendarDay {
  date: Date
  day: number
  month: number
  year: number
  inCurrentMonth: boolean
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export function getDaysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365
}

/**
 * 返回某月第一天是一周的第几天，0 = 周起始日。
 * weekStart = 'monday' 时 0=周一…6=周日；'sunday' 时 0=周日…6=周六。
 */
export function getFirstDayOfWeek(
  year: number,
  month: number,
  weekStart: WeekStart = 'monday'
): number {
  const day = new Date(year, month - 1, 1).getDay()
  if (weekStart === 'sunday') return day
  return day === 0 ? 6 : day - 1
}

export function isWeekend(date: Date): boolean {
  const dow = date.getDay()
  return dow === 0 || dow === 6
}

/**
 * 生成月历网格（周起始对齐，7 列），首尾用上月/下月日期补齐。
 */
export function buildMonthGrid(
  year: number,
  month: number,
  weekStart: WeekStart = 'monday'
): CalendarDay[] {
  const daysInMonth = getDaysInMonth(year, month)
  const offset = getFirstDayOfWeek(year, month, weekStart)
  const prevDaysInMonth = getDaysInMonth(year, month - 1)
  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7

  const cells: CalendarDay[] = []
  for (let i = 0; i < totalCells; i++) {
    const position = i - offset
    let day: number
    let m: number
    let y: number
    let inCurrentMonth: boolean

    if (position < 0) {
      day = prevDaysInMonth + position + 1
      m = month - 1
      y = year
      inCurrentMonth = false
    } else if (position >= daysInMonth) {
      day = position - daysInMonth + 1
      m = month + 1
      y = year
      inCurrentMonth = false
    } else {
      day = position + 1
      m = month
      y = year
      inCurrentMonth = true
    }

    const date = new Date(y, m - 1, day)
    cells.push({ date, day, month: m, year: y, inCurrentMonth })
  }
  return cells
}

export function buildYearMonths(): number[] {
  return Array.from({ length: 12 }, (_, i) => i + 1)
}

export function validateYear(year: number): boolean {
  return Number.isInteger(year) && year >= MIN_YEAR && year <= MAX_YEAR
}

export function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * 返回一年内每个周的起始日（周一或周日，按 weekStart），可能跨年。
 */
export function getWeeksOfYear(year: number, weekStart: WeekStart = 'monday'): Date[] {
  const first = new Date(year, 0, 1)
  const dayOfWeek = first.getDay()
  const diff = weekStart === 'sunday' ? -dayOfWeek : dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const firstStart = new Date(year, 0, 1 + diff)
  const lastDay = new Date(year, 11, 31)
  const weeks: Date[] = []
  for (let d = new Date(firstStart); d <= lastDay; d.setDate(d.getDate() + 7)) {
    weeks.push(new Date(d))
  }
  return weeks
}

/**
 * 返回某个月内的周（以该周最后一天所在月份归属，保证每月1日落在该月的第一周）。
 */
export function getWeeksOfMonth(
  year: number,
  month: number,
  weekStart: WeekStart = 'monday'
): Date[] {
  return getWeeksOfYear(year, weekStart).filter(start => {
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    return end.getFullYear() === year && end.getMonth() === month - 1
  })
}
