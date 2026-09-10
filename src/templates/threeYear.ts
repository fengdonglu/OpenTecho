import { weekdayLabels } from '@/locales'
import { getDaysInMonth, getFirstDayOfWeek } from '@/utils/date'
import { rect, text } from '@/utils/svg'
import type { Language, ThemeConfig, WeekStart } from '@/types'

const ABBR = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

const W = 250
const H = 176

interface CellStyle {
  pad: number
  numSize: number
  abbrSize: number
  titleH: number
  headH: number
  headSize: number
  dateSize: number
  border: number
}

const BIG: CellStyle = {
  pad: 2,
  numSize: 3.5,
  abbrSize: 2,
  titleH: 6,
  headH: 3.5,
  headSize: 1.9,
  dateSize: 1.7,
  border: 0.15,
}

const SMALL: CellStyle = {
  pad: 1.5,
  numSize: 2.5,
  abbrSize: 1.4,
  titleH: 4.5,
  headH: 2.6,
  headSize: 1.4,
  dateSize: 1.15,
  border: 0.12,
}

// 月份内容（无外框）：数字/缩写底部贴星期行上线
function monthContent(
  year: number,
  month: number,
  gx: number,
  gy: number,
  gw: number,
  gh: number,
  st: CellStyle,
  theme: ThemeConfig,
  weekdays: string[],
  weekStart: WeekStart
): string {
  const offset = getFirstDayOfWeek(year, month, weekStart)
  const days = getDaysInMonth(year, month)
  const cw = gw / 7
  const headTopY = gy + st.titleH
  const headBottomY = headTopY + st.headH
  const tableTop = headBottomY
  const rows = Math.max(Math.ceil((offset + days) / 7), 5)
  const cellH = (gy + gh - tableTop) / rows

  let g = ''
  // 数字/缩写 bottom 贴星期行上线（headTopY）之上
  g += text(String(month), {
    x: gx + st.pad,
    y: headTopY - 0.5,
    'font-size': st.numSize,
    'font-weight': 800,
    fill: theme.ink,
  })
  g += text(ABBR[month - 1], {
    x: gx + cw * 6.65,
    y: headTopY - 0.5,
    'text-anchor': 'end',
    'font-size': st.abbrSize,
    fill: theme.muted,
  })

  g += rect({ x: gx, y: headTopY, width: gw, height: 0.1, fill: theme.line, opacity: 0.5 })
  weekdays.forEach((c, i) => {
    g += text(c, {
      x: gx + cw * i + cw / 2,
      y: headTopY + st.headH / 2 + 0.4,
      'text-anchor': 'middle',
      'font-size': st.headSize,
      fill: theme.muted,
    })
  })
  g += rect({ x: gx, y: headBottomY, width: gw, height: 0.1, fill: theme.line, opacity: 0.5 })

  for (let d = 1; d <= days; d++) {
    const pos = offset + d - 1
    const row = Math.floor(pos / 7)
    const col = pos % 7
    g += text(String(d), {
      x: gx + cw * col + cw / 2,
      y: tableTop + row * cellH + cellH / 2,
      'text-anchor': 'middle',
      'dominant-baseline': 'middle',
      'font-size': st.dateSize,
      fill: theme.ink,
    })
  }

  return g
}

// 左页：独立月份框，对称留白，年份框左右对齐月份区
function leftYear(
  year: number,
  x0: number,
  y0: number,
  width: number,
  height: number,
  gap: number,
  st: CellStyle,
  theme: ThemeConfig,
  weekdays: string[],
  weekStart: WeekStart
): string {
  const cols = 3
  const rows = 4
  const cellW = (width - gap * (cols - 1)) / cols
  const cellH = (height - gap * (rows - 1)) / rows

  const yearH = 4
  let g =
    rect({ x: x0, y: y0 - yearH - 2, width, height: yearH, fill: 'none', stroke: theme.line, 'stroke-width': st.border }) +
    text(String(year), {
      x: x0 + width / 2,
      y: y0 - yearH - 2 + yearH / 2 + 1,
      'text-anchor': 'middle',
      'font-size': 3.6,
      'font-weight': 700,
      fill: theme.ink,
    })

  for (let m = 1; m <= 12; m++) {
    const gi = m - 1
    const col = gi % cols
    const row = Math.floor(gi / cols)
    const mx = x0 + col * (cellW + gap)
    const my = y0 + row * (cellH + gap)
    g +=
      rect({ x: mx, y: my, width: cellW, height: cellH, fill: 'none', stroke: theme.line, 'stroke-width': st.border }) +
      monthContent(year, m, mx, my, cellW, cellH, st, theme, weekdays, weekStart)
  }
  return g
}

// 右页：完整表格（第一行年份，月历单元格相邻无间隔）
function rightYear(
  year: number,
  x0: number,
  y0: number,
  width: number,
  height: number,
  st: CellStyle,
  theme: ThemeConfig,
  weekdays: string[],
  weekStart: WeekStart
): string {
  const yearH = 5
  const monthTop = y0 + yearH
  const cols = 4
  const rows = 3
  const cw = width / cols
  const ch = (height - yearH) / rows

  let g = rect({ x: x0, y: y0, width, height, fill: 'none', stroke: theme.line, 'stroke-width': st.border })
  g += text(String(year), {
    x: x0 + width / 2,
    y: y0 + yearH / 2 + 1,
    'text-anchor': 'middle',
    'font-size': 3.6,
    'font-weight': 700,
    fill: theme.ink,
  })
  g += rect({ x: x0, y: monthTop, width, height: 0.1, fill: theme.line, opacity: 0.6 })
  for (let r = 1; r < rows; r++) {
    g += rect({ x: x0, y: monthTop + r * ch, width, height: 0.1, fill: theme.line, opacity: 0.5 })
  }
  for (let c = 1; c < cols; c++) {
    g += rect({ x: x0 + c * cw, y: monthTop, width: 0.1, height: rows * ch, fill: theme.line, opacity: 0.5 })
  }
  for (let m = 1; m <= 12; m++) {
    const gi = m - 1
    const col = gi % cols
    const row = Math.floor(gi / cols)
    g += monthContent(year, m, x0 + col * cw, monthTop + row * ch, cw, ch, st, theme, weekdays, weekStart)
  }
  return g
}

export function threeYearBody(
  year: number,
  theme: ThemeConfig,
  language: Language,
  weekStart: WeekStart
): string {
  const weekdays = weekdayLabels(language, weekStart)

  let s = rect({ x: 0, y: 0, width: W, height: H, fill: theme.background })
  s += rect({ x: 124.5, y: 0, width: 0.3, height: H, fill: theme.hair })

  // 对称留白：左右 6mm，上下 6mm
  // 左页（3×4）：x 6–119，月份区 y 13–170，年份框顶线 y=7
  s += leftYear(year, 6, 13, 113, 157, 3, BIG, theme, weekdays, weekStart)
  // 右页上（4×3 表格）：x 131–244，y 7–84
  s += rightYear(year - 1, 131, 7, 113, 77, SMALL, theme, weekdays, weekStart)
  // 右页下（4×3 表格）：x 131–244，y 92–169
  s += rightYear(year + 1, 131, 92, 113, 77, SMALL, theme, weekdays, weekStart)

  return s
}
