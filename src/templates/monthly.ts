import { SPREAD_DIMENSIONS } from '@/utils/constants'
import { getDaysInMonth, getFirstDayOfWeek } from '@/utils/date'
import { weekdayLabels } from '@/locales'
import { getHolidaysForLanguage, holidayLabel } from '@/utils/holiday'
import { backgroundGrid, group, line, path, rect, text } from '@/utils/svg'
import type { Language, ThemeConfig, WeekStart } from '@/types'

const CELL_W = 10
const CELL_H = 10
const AXIS_HALF_WIDTH = 3

function monthStyle(theme: ThemeConfig): string {
  return (
    '<style>' +
    `:root{--month-line:${theme.line};--gutter-color:${theme.hair};--rest:${theme.hair};--axis-extend:${theme.muted};--axis-extend-width:.15;--title-size:12px;--date-size:1.6px;--head-size:2px;--accent:${theme.accent}}` +
    'text{font-family:"Inter","Segoe UI","Noto Sans SC","PingFang SC",system-ui,sans-serif;fill:var(--ink)}' +
    '.title{font-size:var(--title-size);font-weight:800;letter-spacing:.5px;fill:var(--accent)}' +
    '.hair{stroke:var(--gutter-color);stroke-opacity:.8;stroke-width:.3}' +
    '.table{stroke:var(--month-line);stroke-width:.15;fill:none}' +
    '.wkbg{fill:var(--rest)}' +
    '</style>'
  )
}

function monthCalendar(
  year: number,
  month: number,
  language: Language,
  weekStart: WeekStart
): string {
  const offset = getFirstDayOfWeek(year, month, weekStart)
  const daysInMonth = getDaysInMonth(year, month)
  const rowCount = Math.ceil((offset + daysInMonth) / 7)
  const totalHeight = rowCount * CELL_H
  const gridW = CELL_W * 7

  let parts = rect({ x: 0, y: 0, width: gridW, height: totalHeight, class: 'table' })

  parts += path(
    Array.from({ length: rowCount + 1 }, (_, r) => `M0 ${r * CELL_H} H${gridW}`).join(' '),
    { class: 'table' }
  )

  parts += path(
    Array.from({ length: 7 }, (_, c) => `M${(c + 1) * CELL_W} 0 V${totalHeight}`).join(' '),
    { class: 'table' }
  )

  const dowGroup = weekdayLabels(language, weekStart)
    .map((letter, col) =>
      text(letter, {
        x: col * CELL_W + CELL_W / 2,
        y: -2,
        'text-anchor': 'middle',
        'font-size': 'var(--head-size)',
        'font-weight': 600,
      })
    )
    .join('')
  parts += group(dowGroup)

  const weekNumbers = Array.from({ length: rowCount }, (_, row) =>
    text(`W${row + 1}`, {
      x: -2,
      y: row * CELL_H + CELL_H / 2,
      'font-size': 2.8,
      fill: '#666',
      'text-anchor': 'end',
      'dominant-baseline': 'middle',
    })
  ).join('')
  parts += group(weekNumbers)

  // 日期数字在该字号下的近似宽（单位 mm），用于让节日紧贴数字右侧（距离=0）
  const digitWidth = (n: number) => (n < 10 ? 0.95 : 1.89)

  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const col = (offset + i) % 7
    const row = Math.floor((offset + i) / 7)
    // 日期数字（单元格左上角）
    const dateText = text(String(day), {
      x: col * CELL_W + 1,
      y: row * CELL_H + 0.5,
      'font-size': 'var(--date-size)',
      fill: '#444',
      'text-anchor': 'start',
      'dominant-baseline': 'hanging',
    })

    const date = new Date(year, month - 1, day)
    const holiday = getHolidaysForLanguage(language, date)[0]
    if (!holiday) return dateText

    // 节日显示在日期数字右侧，与日期数字间距为 0（紧贴数字右边界）
    const holidayText = text(holidayLabel(holiday, language), {
      x: col * CELL_W + 1 + digitWidth(day),
      y: row * CELL_H + 0.5,
      'font-size': 'var(--date-size)',
      fill: holiday.type === 'western' ? 'var(--accent)' : 'var(--muted)',
      'text-anchor': 'start',
      'dominant-baseline': 'hanging',
    })
    return dateText + holidayText
  }).join('')
  parts += group(dayNumbers)

  return group(parts, { transform: 'translate(25,30)' })
}

function gongAxis(year: number, month: number): string {
  const daysInMonth = getDaysInMonth(year, month)
  // 每格 5mm，与背景网格成整数比（线条经过背景点阵），轴高随天数
  const rowHeight = 5
  const axisHeight = daysInMonth * rowHeight

  let parts = rect({
    x: -AXIS_HALF_WIDTH,
    y: 0,
    width: AXIS_HALF_WIDTH * 2,
    height: axisHeight,
    class: 'table',
  })

  const weekendMarks: string[] = []
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day)
    const isSaturday = date.getDay() === 6
    const isSunday = date.getDay() === 0
    if (!isSaturday && !isSunday) continue
    const y = (day - 1) * rowHeight
    // 周末两天灰底
    weekendMarks.push(rect({ x: -AXIS_HALF_WIDTH, y, width: AXIS_HALF_WIDTH * 2, height: rowHeight, class: 'wkbg' }))
    // 上线：周六单元格上边框
    if (isSaturday) {
      weekendMarks.push(
        line({ x1: -62.5, y1: y, x2: 62.5, y2: y, stroke: 'var(--axis-extend)', 'stroke-width': 'var(--axis-extend-width)' })
      )
    }
    // 下线：周日单元格下边框
    if (isSunday) {
      weekendMarks.push(
        line({ x1: -62.5, y1: y + rowHeight, x2: 62.5, y2: y + rowHeight, stroke: 'var(--axis-extend)', 'stroke-width': 'var(--axis-extend-width)' })
      )
    }
  }
  parts += group(weekendMarks.join(''))

  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) =>
    text(String(i + 1), {
      x: 0,
      y: (i + 0.5) * rowHeight,
      'font-size': 2.4,
      fill: '#555',
      'text-anchor': 'middle',
      'dominant-baseline': 'middle',
    })
  ).join('')
  parts += group(dayNumbers)

  return group(parts, { transform: 'translate(62.5,20)' })
}

// 右边缘月份指示器已移除（月份指示器仅周历显示）

export function monthlyBody(
  year: number,
  month: number,
  theme: ThemeConfig,
  language: Language,
  weekStart: WeekStart
): string {
  const title = String(month)

  const left = group(
    text(title, { x: 62.5, y: 16, 'text-anchor': 'middle', class: 'title' }) +
      monthCalendar(year, month, language, weekStart),
    { id: 'leftPage' }
  )

  const axisTop = 20
  const axisBottom = axisTop + getDaysInMonth(year, month) * 5

  const rightInner =
    text(title, { x: 62.5, y: 16, 'text-anchor': 'middle', class: 'title' }) +
    gongAxis(year, month) +
    group(
      line({
        x1: 0,
        y1: axisTop,
        x2: 125,
        y2: axisTop,
        stroke: 'var(--axis-extend)',
        'stroke-width': 'var(--axis-extend-width)',
      }) +
        line({
          x1: 0,
          y1: axisBottom,
          x2: 125,
          y2: axisBottom,
          stroke: 'var(--axis-extend)',
          'stroke-width': 'var(--axis-extend-width)',
        })
    )

  const right = group(rightInner, { id: 'rightPage', transform: 'translate(125,0)' })

  const gutter = line({
    x1: 125,
    y1: 6,
    x2: 125,
    y2: 170,
    class: 'hair',
    'stroke-dasharray': '1.5 1.5',
  })

  return monthStyle(theme) + backgroundGrid(SPREAD_DIMENSIONS, theme) + gutter + left + right
}
