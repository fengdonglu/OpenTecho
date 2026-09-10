import { weeklyBody } from '@/templates/weekly'
import { THEMES } from '@/utils/constants'
import { svgDocument } from '@/utils/svg'
import { writeFileSync } from 'node:fs'

// 2023-12-11 那一周（周一到周日），简体中文，匹配周历原型
const monday = new Date(2023, 11, 11)
const theme = THEMES.minimal
const svg = svgDocument(
  { width: 250, height: 176, unit: 'mm' },
  theme,
  weeklyBody(monday, theme, 'zh-CN', 'monday', 2023)
)

writeFileSync('prototypes/scans/weekly-overview.svg', svg, 'utf8')
console.log('已生成周历原型 weekly-overview.svg:', (svg.length / 1024).toFixed(1), 'KB')
