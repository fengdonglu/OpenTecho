import { messages } from '@/locales'
import { line, rect, text } from '@/utils/svg'
import type { Language, PageDimensions, ThemeConfig } from '@/types'

export function introBody(
  dimensions: PageDimensions,
  theme: ThemeConfig,
  language: Language
): string {
  const m = messages[language]
  const { width } = dimensions

  let body = rect({
    x: 0,
    y: 0,
    width: dimensions.width,
    height: dimensions.height,
    fill: theme.background,
  })

  body += text(m.introTitle, {
    x: width / 2,
    y: 20,
    'text-anchor': 'middle',
    'font-size': 8,
    'font-weight': 800,
    fill: theme.accent,
  })

  body += line({ x1: 24, y1: 28, x2: width - 24, y2: 28, stroke: theme.hair, 'stroke-width': 0.3 })

  const startY = 38
  m.introItems.forEach((item, i) => {
    const y = startY + i * 9
    body += text(`${i + 1}`, {
      x: 24,
      y,
      'font-size': 3.4,
      'font-weight': 700,
      fill: theme.accent,
    })
    body += text(item, {
      x: 32,
      y,
      'font-size': 3.2,
      fill: theme.ink,
    })
  })

  return body
}
