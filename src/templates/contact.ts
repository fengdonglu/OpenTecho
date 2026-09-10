import { path, rect, text } from '@/utils/svg'
import type { Language, PageDimensions, ThemeConfig } from '@/types'
import { messages } from '@/locales'

const MARGIN_X = 10
const TOP = 22
const ROW_H = 7

const COLS = [
  { x: 0, w: 24 },
  { x: 24, w: 27 },
  { x: 51, w: 25 },
  { x: 76, w: 29 },
]

export function contactBody(
  dimensions: PageDimensions,
  theme: ThemeConfig,
  language: Language
): string {
  const { width, height } = dimensions
  const m = messages[language]

  const title = text(m.contact, {
    x: width / 2,
    y: 14,
    'text-anchor': 'middle',
    'font-size': 4.2,
    'font-weight': 700,
    fill: theme.accent,
    'letter-spacing': '1px',
  })

  const tableW = width - MARGIN_X * 2
  const bottom = height - 8
  const rows = Math.floor((bottom - TOP) / ROW_H)
  const tableBottom = TOP + rows * ROW_H

  const cols = COLS.map(c => ({ x: MARGIN_X + c.x, w: c.w }))
  const rightEdge = MARGIN_X + tableW

  // 外框
  let table = rect({
    x: MARGIN_X,
    y: TOP,
    width: tableW,
    height: tableBottom - TOP,
    fill: 'none',
    stroke: theme.line,
    'stroke-width': 0.4,
  })

  // 横向分隔线
  table += path(
    Array.from({ length: rows - 1 }, (_, i) => `M${MARGIN_X} ${TOP + (i + 1) * ROW_H} H${rightEdge}`).join(' '),
    { stroke: theme.hair, 'stroke-width': 0.25 }
  )

  // 竖向栏分隔线（虚线，姓名栏右边为实线更清晰）
  table += path(
    cols.slice(1).map(c => `M${c.x} ${TOP} V${tableBottom}`).join(' '),
    { stroke: theme.hair, 'stroke-width': 0.2, 'stroke-dasharray': '1 1' }
  )

  return (
    rect({ x: 0, y: 0, width, height, fill: theme.background }) +
    title +
    table
  )
}
