import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'

const svgPath = 'prototypes/scans/year2-overview.svg'
const svg = readFileSync(svgPath, 'utf8')
const b64 = Buffer.from(svg).toString('base64')

const browser = await chromium.launch({ channel: 'msedge', headless: true })
// 高倍放大：SVG 按 3320px 宽渲染，再 clip 左页 1 月列区域
const page = await browser.newPage({ viewport: { width: 3320, height: 2338 } })
await page.setContent(`<html><body style="margin:0"><img style="display:block;width:3320px;height:2338px" src="data:image/svg+xml;base64,${b64}"></body></html>`)
// 左表 translate(8,14)+1月列 x≈7mm，表高 148mm。取 x 8..40mm, y 14..70mm
const pxPerMm = 3320 / 250
await page.screenshot({
  path: 'prototypes/scans/year2-zoom.png',
  clip: { x: 8 * pxPerMm, y: 14 * pxPerMm, width: 40 * pxPerMm, height: 70 * pxPerMm },
})
console.log('已放大截图左页1月列')
await browser.close()
