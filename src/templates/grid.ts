import { backgroundGrid } from '@/utils/svg'
import type { PageDimensions, ThemeConfig } from '@/types'

export function gridBody(dimensions: PageDimensions, theme: ThemeConfig): string {
  return backgroundGrid(dimensions, theme)
}
