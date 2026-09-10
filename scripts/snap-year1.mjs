import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'

const svgPath = 'D:/Prototypes/packages/web-apps/OpenTecho/prototypes/scans/year1-overview.svg'
const svg = readFileSync(svgPath, 'utf8')
const b64 = Buffer.from(svg).toString('base64')

// 匹配原图 year1-cr.jpg (3320×2308) 的比例，按 SVG 250:176 放大到 3320px 宽
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 3320, height: 2338 } })
const html = `<!doctype html><html><body style="margin:0;background:#fff"><img style="display:block;width:100%" src="data:image/svg+xml;base64,${b64}"></body></html>`
await page.setContent(html)
await page.screenshot({ path: 'D:/Prototypes/packages/web-apps/OpenTecho/prototypes/scans/year1-hi.png' })
console.log('已高清截图（3320 宽）')
await browser.close()
