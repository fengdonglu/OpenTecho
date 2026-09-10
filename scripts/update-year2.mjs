import { yearlyBody } from '@/templates/yearly'
import { THEMES } from '@/utils/constants'
import { svgDocument } from '@/utils/svg'
import { writeFileSync } from 'node:fs'

// 用软件里的当年年历模板生成 2023 版原型（匹配 year2-cr.jpg），简体中文（含红色法定假日/农历/节气）
const theme = THEMES.minimal
const svg = svgDocument(
  { width: 250, height: 176, unit: 'mm' },
  theme,
  yearlyBody(2023, theme, 'zh-CN', 'monday')
)

writeFileSync('prototypes/scans/year2-overview.svg', svg, 'utf8')
console.log('已生成当年年历原型 year2-overview.svg:', (svg.length / 1024).toFixed(1), 'KB')
