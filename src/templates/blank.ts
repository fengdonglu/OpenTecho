import { rect } from '@/utils/svg'
import type { PageDimensions, ThemeConfig } from '@/types'

export function blankBody(dimensions: PageDimensions, theme: ThemeConfig): string {
  return rect({
    x: 0,
    y: 0,
    width: dimensions.width,
    height: dimensions.height,
    fill: theme.background,
  })
}
