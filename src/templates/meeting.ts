import { line, path, rect, text } from '@/utils/svg'
import type { Language, PageDimensions, ThemeConfig } from '@/types'
import { messages } from '@/locales'

const MARGIN_X = 10
const HEAD_TOP = 23
const HEAD_ROW_H = 11
const BODY_ROW_H = 5.2

const FIELD_LABELS: Record<Language, string[]> = {
  'zh-CN': ['时间', '地点', '主持人', '记录人', '与会人', '议题'],
  'zh-TW': ['時間', '地點', '主持人', '記錄人', '與會人', '議題'],
  en: ['Time', 'Venue', 'Host', 'Recorder', 'Attendees', 'Agenda'],
}

// 三行双栏信息头（每项是 FIELD_LABELS 的索引）
const HEAD_ROWS = [
  [0, 1],
  [2, 3],
  [4, 5],
]

export function meetingBody(
  dimensions: PageDimensions,
  theme: ThemeConfig,
  language: Language
): string {
  const { width, height } = dimensions
  const m = messages[language]

  const title = text(m.meeting, {
    x: width / 2,
    y: 14,
    'text-anchor': 'middle',
    'font-size': 4.2,
    'font-weight': 700,
    fill: theme.accent,
    'letter-spacing': '1px',
  })

  const tableW = width - MARGIN_X * 2
  const rightEdge = MARGIN_X + tableW
  const headBottom = HEAD_TOP + HEAD_ROWS.length * HEAD_ROW_H
  const colMid = MARGIN_X + tableW / 2

  // 信息头外框
  let head = rect({
    x: MARGIN_X,
    y: HEAD_TOP,
    width: tableW,
    height: headBottom - HEAD_TOP,
    fill: 'none',
    stroke: theme.line,
    'stroke-width': 0.4,
  })

  // 三行横向分隔
  head += path(
    Array.from({ length: HEAD_ROWS.length - 1 }, (_, i) => `M${MARGIN_X} ${HEAD_TOP + (i + 1) * HEAD_ROW_H} H${rightEdge}`).join(' '),
    { stroke: theme.hair, 'stroke-width': 0.25 }
  )

  // 中缝竖分隔
  head += line({
    x1: colMid,
    y1: HEAD_TOP,
    x2: colMid,
    y2: headBottom,
    stroke: theme.hair,
    'stroke-width': 0.25,
  })

  // 字段标签
  const labels = FIELD_LABELS[language]
  HEAD_ROWS.forEach(([li, ri], row) => {
    const y = HEAD_TOP + row * HEAD_ROW_H
    head += text(labels[li], {
      x: MARGIN_X + 1.6,
      y: y + 3.4,
      'font-size': 2.3,
      fill: theme.muted,
    })
    head += text(labels[ri], {
      x: colMid + 1.6,
      y: y + 3.4,
      'font-size': 2.3,
      fill: theme.muted,
    })
  })

  // 主体横线留白
  const bodyTop = headBottom + 2
  const bodyBottom = height - 8
  const bodyRows = Math.floor((bodyBottom - bodyTop) / BODY_ROW_H)
  const lines = path(
    Array.from({ length: bodyRows }, (_, i) => `M${MARGIN_X} ${bodyTop + i * BODY_ROW_H} H${rightEdge}`).join(' '),
    { stroke: theme.hair, 'stroke-width': 0.2 }
  )

  return (
    rect({ x: 0, y: 0, width, height, fill: theme.background }) +
    title +
    head +
    lines
  )
}
