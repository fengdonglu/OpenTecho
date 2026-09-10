import { SPREAD_DIMENSIONS } from '@/utils/constants'
import { buildYearMonths, getDaysInMonth, getFirstDayOfWeek, isWeekend } from '@/utils/date'
import { getHolidaysForLanguage, getHolidaysOfDate, holidayLabel, isLegalHolidayCn } from '@/utils/holiday'
import { solarToLunar } from '@/utils/lunar'
import { group, line, path, rect, text } from '@/utils/svg'
import type { Language, ThemeConfig, WeekStart } from '@/types'

const TABLE_W = 110
const TABLE_H = 148
const LABEL_W = 7
const COL_W = (TABLE_W - LABEL_W) / 6
const HEADER_H = 6
const ROW_H = (TABLE_H - HEADER_H) / 31
const ABBR = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const EN_WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

function yearlyStyle(theme: ThemeConfig): string {
  return (
    '<style>' +
    `:root{--year-line:${theme.line};--gutter-color:${theme.hair}}` +
    'text{font-family:"Inter","Segoe UI","Noto Sans SC","PingFang SC",system-ui,sans-serif;fill:var(--ink)}' +
    '.table{stroke:var(--year-line);stroke-width:.15;fill:none}' +
    '.frame{fill:none;stroke:var(--year-line);stroke-opacity:.12}' +
    '.hair{stroke:var(--gutter-color);stroke-opacity:.6;stroke-width:.25}' +
    '.day{font-size:2.4px;fill:var(--muted)}' +
    '</style>'
  )
}

function monthColumn(
  year: number,
  month: number,
  colX: number,
  language: Language,
  weekStart: WeekStart,
  theme: ThemeConfig
): string {
  const offset = getFirstDayOfWeek(year, month, weekStart)
  const daysInMonth = getDaysInMonth(year, month)
  const isZH = language === 'zh-CN' || language === 'zh-TW'
  const marks: string[] = []

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d)
    const y = HEADER_H + (d - 1) * ROW_H
    const lunar = solarToLunar(date)
    const dow = ((offset + d - 1) % 7) + 1

    // 背景：法定假日（主题 accent，仅简体） > 周末（主题 muted）
    if (language === 'zh-CN' && isLegalHolidayCn(date, lunar)) {
      marks.push(rect({ x: 0, y, width: COL_W, height: ROW_H, fill: theme.accent, 'fill-opacity': 0.4 }))
    } else if (isWeekend(date)) {
      marks.push(rect({ x: 0, y, width: COL_W, height: ROW_H, fill: theme.muted, 'fill-opacity': 0.18 }))
    }

    // 单元格左侧：上=星期，下=文字
    const weekLabel = language === 'en' ? EN_WEEKDAYS[dow - 1] : String(dow)
    marks.push(
      text(weekLabel, {
        x: 0.6,
        y: y + ROW_H * 0.3,
        'font-size': language === 'en' ? 1.4 : 1.7,
        fill: theme.muted,
        'dominant-baseline': 'middle',
      })
    )

    // 文字：节假日与节气并排显示（先节日后节气），无节日时退回节气/农历（初一显示月名）
    // 英文版：西方节日 + 国际通用节日（元旦/劳动节等）
    const holiday =
      language === 'en'
        ? getHolidaysForLanguage(language, date)[0]
        : getHolidaysOfDate(date).find((h) => h.type !== 'western')
    let note = holiday ? holidayLabel(holiday, language) : ''
    if (isZH) {
      const extra = lunar.jieqi || (lunar.day === 1 ? lunar.monthName : lunar.dayName)
      if (note && extra) note = `${note} ${extra}`
      else if (!note) note = extra
    }
    if (note) {
      marks.push(
        text(note, {
          x: 0.6,
          y: y + ROW_H * 0.72,
          'font-size': 1.6,
          fill: theme.muted,
          'dominant-baseline': 'middle',
        })
      )
    }
  }

  return group(marks.join(''), { transform: `translate(${colX},0)` })
}

function yearTable(
  year: number,
  months: number[],
  language: Language,
  weekStart: WeekStart,
  theme: ThemeConfig
): string {
  let parts = rect({ x: 0, y: 0, width: TABLE_W, height: TABLE_H, class: 'table' })

  parts += path(
    Array.from({ length: 7 }, (_, i) => `M${LABEL_W + i * COL_W} 0 V${TABLE_H}`).join(' '),
    { class: 'table' }
  )

  parts += path(
    Array.from({ length: 31 }, (_, r) => `M0 ${HEADER_H + r * ROW_H} H${TABLE_W}`).join(' '),
    { class: 'table' }
  )

  parts += group(
    months
      .map((m, i) => {
        const mx = LABEL_W + i * COL_W
        return (
          text(String(m), { x: mx + 1, y: HEADER_H - 1.7, 'font-size': 2.6, 'font-weight': 700 }) +
          text(ABBR[m - 1], {
            x: mx + COL_W - 1,
            y: HEADER_H - 1.7,
            'text-anchor': 'end',
            'font-size': 1.9,
            fill: '#777777',
          })
        )
      })
      .join('')
  )

  parts += group(
    Array.from({ length: 31 }, (_, r) =>
      text(String(r + 1), {
        x: 3.5,
        y: HEADER_H + (r + 0.5) * ROW_H,
        'text-anchor': 'middle',
        'dominant-baseline': 'middle',
        class: 'day',
      })
    ).join('')
  )

  parts += months
    .map((m, i) => monthColumn(year, m, LABEL_W + i * COL_W, language, weekStart, theme))
    .join('')

  return parts
}

export function yearlyBody(
  year: number,
  theme: ThemeConfig,
  language: Language,
  weekStart: WeekStart
): string {
  const months = buildYearMonths()
  const frame = rect({ x: 1.5, y: 1.5, width: 247, height: 173, rx: 2, class: 'frame' })
  const gutter = line({
    x1: 125,
    y1: 6,
    x2: 125,
    y2: 170,
    class: 'hair',
    'stroke-dasharray': '1.5 1.5',
  })
  const left = group(yearTable(year, months.slice(0, 6), language, weekStart, theme), {
    transform: 'translate(8,14)',
  })
  const right = group(yearTable(year, months.slice(6), language, weekStart, theme), {
    transform: 'translate(132,14)',
  })

  return (
    yearlyStyle(theme) +
    rect({ x: 0, y: 0, width: SPREAD_DIMENSIONS.width, height: SPREAD_DIMENSIONS.height, fill: theme.background }) +
    frame +
    gutter +
    left +
    right
  )
}
