import { threeYearBody } from '@/templates/threeYear'
import { THEMES } from '@/utils/constants'
import { svgDocument } from '@/utils/svg'
import { writeFileSync } from 'node:fs'

// 用软件里的三年年历模板生成 2023 版原型（含 2022/2023/2024），供审核对比
// 用英文周几(M T W T F S)以匹配原图扫描
const theme = THEMES.minimal
const svg = svgDocument(
  { width: 250, height: 176, unit: 'mm' },
  theme,
  threeYearBody(2023, theme, 'en', 'monday')
)

writeFileSync('prototypes/scans/year1-overview.svg', svg, 'utf8')
console.log('已更新原型 year1-overview.svg:', (svg.length / 1024).toFixed(1), 'KB')
