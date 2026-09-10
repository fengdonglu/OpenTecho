import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'

const svgPath = process.argv[2] || 'prototypes/scans/year1-overview.svg'
const outPath = process.argv[3] || 'prototypes/scans/snap.png'

const svg = readFileSync(svgPath, 'utf8')
const b64 = Buffer.from(svg).toString('base64')

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 3320, height: 2338 } })
const html = `<!doctype html><html><body style="margin:0;background:#fff"><img style="display:block;width:100%" src="data:image/svg+xml;base64,${b64}"></body></html>`
await page.setContent(html)
await page.screenshot({ path: outPath })
console.log('已截图:', outPath)
await browser.close()
