import { SPREAD_DIMENSIONS } from '@/utils/constants'
import { getDaysInMonth, getFirstDayOfWeek, getWeeksOfYear } from '@/utils/date'
import { weekdayLabels } from '@/locales'
import { getHolidaysForLanguage, holidayLabel } from '@/utils/holiday'
import { LUNAR_MONTH_NUM, solarToLunar } from '@/utils/lunar'
import { backgroundGrid, circle, group, line, path, rect, text } from '@/utils/svg'
import type { Language, ThemeConfig, WeekStart } from '@/types'

// 面板尺寸对齐背景 5mm 网格（50×75），位置也取 5mm 倍数
const PANEL_POS = [
  { x: 65, y: 10 }, // 周一
  { x: 130, y: 10 }, // 周二
  { x: 190, y: 10 }, // 周三
  { x: 5, y: 90 }, // 周四
  { x: 65, y: 90 }, // 周五
  { x: 130, y: 90 }, // 周六
  { x: 190, y: 90 }, // 周日
]
const PANEL_BORDER_PATH = `M2 0 L20 0 M30 0 L48 0 Q50 0 50 2 L50 73 Q50 75 48 75 L2 75 Q0 75 0 73 L0 2 Q0 0 2 0`
const EN_WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

function weeklyStyle(theme: ThemeConfig): string {
  return (
    '<style>' +
    `:root{--accent:${theme.accent};--panel-stroke:${theme.line};--cross-stroke:${theme.hair}}` +
    'text{font-family:"Inter","Segoe UI","Noto Sans SC","PingFang SC",system-ui,sans-serif;fill:var(--ink)}' +
    '.month-large{font-size:13px;font-weight:800;fill:var(--accent)}' +
    '.year-small{font-size:3.4px;fill:var(--muted)}' +
    '.mini-head{font-size:1.4px;fill:var(--muted)}' +
    '.mini-day{font-size:1.4px;fill:var(--muted)}' +
    '.mini-current{font-size:1.4px;font-weight:bold;fill:var(--ink)}' +
    '.mini-weekbg{fill:var(--accent);fill-opacity:.18}' +
    '.panel-border{fill:none;stroke:var(--panel-stroke);stroke-width:.22}' +
    '.badge{fill:none;stroke:var(--panel-stroke);stroke-width:.18}' +
    '.panel-date{font-size:4px;font-weight:bold;fill:var(--ink)}' +
    '.weekday-small{font-size:1.6px;fill:var(--muted)}' +
    '.lunar-date{font-size:1.5px;fill:var(--muted)}' +
    '.festival{font-size:1.5px;fill:var(--accent)}' +
    '.week-number{font-size:1.8px;fill:var(--muted)}' +
    '.page-num{font-size:1.8px;fill:var(--muted)}' +
    '.hair{stroke:var(--hair);stroke-opacity:.6;stroke-width:.25}' +
    '.cross-line{stroke:var(--cross-stroke);stroke-width:.15}' +
    '</style>'
  )
}

function miniCalendar(weekMonday: Date, language: Language, weekStart: WeekStart): string {
  const year = weekMonday.getFullYear()
  const month = weekMonday.getMonth() + 1
  const offset = getFirstDayOfWeek(year, month, weekStart)
  const daysInMonth = getDaysInMonth(year, month)
  const cw = 2
  const ch = 2

  const header = weekdayLabels(language, weekStart)
    .map((letter, i) => text(letter, { x: i * cw + cw / 2, y: 1.2, 'text-anchor': 'middle', class: 'mini-head' }))
    .join('')

  const weekStartMs = weekMonday.getTime()
  const weekEnd = weekStartMs + 6 * 86400000

  const cells: string[] = []
  for (let d = 1; d <= daysInMonth; d++) {
    const col = (offset + d - 1) % 7
    const row = Math.floor((offset + d - 1) / 7)
    const time = new Date(year, month - 1, d).getTime()
    const inWeek = time >= weekStartMs && time <= weekEnd
    const cy = 2.2 + row * ch + ch / 2
    if (inWeek) cells.push(rect({ x: col * cw, y: 2.2 + row * ch, width: cw, height: ch, class: 'mini-weekbg' }))
    cells.push(
      text(String(d), { x: col * cw + cw / 2, y: cy, 'text-anchor': 'middle', 'dominant-baseline': 'middle', class: inWeek ? 'mini-current' : 'mini-day' })
    )
  }

  return group(header) + group(cells.join(''))
}

// 月份数字 + 年份：均右对齐到同一右端，保证任何月份都尾对齐
// 月份数字顶边固定；年份下缘对齐当月小月历实际下缘（行数不同下缘会变）
function weeklyOverview(weekMonday: Date, language: Language, weekStart: WeekStart): string {
  const month = weekMonday.getMonth() + 1
  const year = weekMonday.getFullYear()
  const right = 12.2

  const offset = getFirstDayOfWeek(year, month, weekStart)
  const daysInMonth = getDaysInMonth(year, month)
  const rows = Math.ceil((offset + daysInMonth) / 7)
  // 小月历经 translate(17,2) 后，最后一行单元格下缘（group 坐标）
  const miniBottom = 2 + (4.2 + (rows - 1) * 2)

  const inner =
    text(String(month), { x: right, y: 11.5, class: 'month-large', 'text-anchor': 'end' }) +
    text(String(year), { x: right, y: miniBottom, class: 'year-small', 'text-anchor': 'end' }) +
    group(miniCalendar(weekMonday, language, weekStart), { transform: 'translate(17,2)' })

  return group(inner, { id: 'weekly-overview', transform: 'translate(6,6)' })
}

function dayPanel(date: Date, pos: { x: number; y: number }, language: Language): string {
  const lunar = solarToLunar(date)
  const lunarShort = LUNAR_MONTH_NUM[lunar.month - 1] + '月' + lunar.dayName
  const holiday = getHolidaysForLanguage(language, date)[0]
  const weekLabel = language === 'en' ? EN_WEEKDAYS[(date.getDay() + 6) % 7] : String((date.getDay() + 6) % 7 + 1)

  // 日期数字：垂直中线对齐面板上框线（面板顶=0）
  // 星期：数字下方；圆角标签框围绕数字+星期（下边中央掏空）
  const bw = 8
  const bh = 6
  const bx = 25 - bw / 2
  const by = -2.6 // 框顶（数字上方）
  const half = bw / 2
  const gap = 1.5
  const badgePath =
    `M${bx + 0.8} ${by} H${bx + bw - 0.8} Q${bx + bw} ${by} ${bx + bw} ${by + 0.8} V${by + bh - 0.8} ` +
    `Q${bx + bw} ${by + bh} ${bx + bw - 0.8} ${by + bh} H${bx + half + gap} M${bx + half - gap} ${by + bh} H${bx + 0.8} ` +
    `Q${bx} ${by + bh} ${bx} ${by + bh - 0.8} V${by + 0.8} Q${bx} ${by} ${bx + 0.8} ${by}`

  let inner =
    path(PANEL_BORDER_PATH, { class: 'panel-border' }) +
    path(badgePath, { class: 'badge' }) +
    text(String(date.getDate()), { x: 25, y: 1.4, class: 'panel-date', 'text-anchor': 'middle' }) +
    text(weekLabel, { x: 25, y: 3.2, class: 'weekday-small', 'text-anchor': 'middle' }) +
    line({ x1: 25, y1: 5, x2: 25, y2: 72, class: 'cross-line' }) +
    circle({ cx: 25, cy: 40, r: 0.5, fill: 'var(--accent)' })

  if (language !== 'en') inner += text(lunarShort, { x: 2, y: 73.5, class: 'lunar-date' })
  if (holiday) inner += text(holidayLabel(holiday, language), { x: 48, y: 73.5, 'text-anchor': 'end', class: 'festival' })

  return group(inner, { transform: `translate(${pos.x},${pos.y})` })
}

// 右边缘：只显示当前月份的窄单元格（背景反白），左框线对齐日期面板最右框线
function monthRail(monday: Date, theme: ThemeConfig, mainYear: number): string {
  const y = monday.getFullYear()
  const m = monday.getMonth() + 1
  let pos = -1
  if (y === mainYear - 1) pos = m - 10
  else if (y === mainYear) pos = 3 + (m - 1)
  else if (y === mainYear + 1) pos = 15 + (m - 1)
  if (pos < 0) return ''

  const railX = 245
  const cellW = 4
  const cellH = 7
  const cy = 20 + pos * cellH
  return (
    rect({ x: railX, y: cy, width: cellW, height: cellH, fill: theme.accent }) +
    text(String(m), { x: railX + cellW / 2, y: cy + cellH / 2 + 0.8, 'text-anchor': 'middle', 'font-size': 2.2, 'font-weight': 700, fill: '#fff' })
  )
}

export function weeklyBody(
  weekMonday: Date,
  theme: ThemeConfig,
  language: Language,
  weekStart: WeekStart,
  mainYear: number
): string {
  const gutter = line({
    x1: 125,
    y1: 6,
    x2: 125,
    y2: 170,
    class: 'hair',
    'stroke-dasharray': '1.5 1.5',
  })

  const panels = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekMonday.getTime() + i * 86400000)
    return dayPanel(date, PANEL_POS[i], language)
  }).join('')

  const weeks = getWeeksOfYear(weekMonday.getFullYear(), weekStart)
  const weekNo = weeks.findIndex((w) => w.getTime() === new Date(weekMonday.getFullYear(), weekMonday.getMonth(), weekMonday.getDate()).getTime()) + 1

  return (
    weeklyStyle(theme) +
    backgroundGrid(SPREAD_DIMENSIONS, theme) +
    gutter +
    weeklyOverview(weekMonday, language, weekStart) +
    panels +
    monthRail(weekMonday, theme, mainYear) +
    text(`W${weekNo}`, { x: 4, y: 172, class: 'week-number' }) +
    text(String(weekNo), { x: 246, y: 172, 'text-anchor': 'end', class: 'page-num' })
  )
}
