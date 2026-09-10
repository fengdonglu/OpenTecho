import { chromium } from 'playwright'

const url = process.env.URL || 'http://localhost:3000'

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const context = await browser.newContext({ acceptDownloads: true })
const page = await context.newPage()

const errors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`[console.error] ${msg.text()}`)
})
page.on('pageerror', (err) => errors.push(`[pageerror] ${err.message}`))

await page.goto(url, { waitUntil: 'networkidle' })
console.log('页面已加载:', url)

const button = page.getByRole('button', { name: /Export PDF|导出 PDF|匯出 PDF/i })
if ((await button.count()) === 0) {
  console.error('找不到「导出 PDF」按钮')
  process.exit(1)
}

const downloadPromise = page.waitForEvent('download', { timeout: 120000 })
await button.click()
console.log('已点击导出 PDF，等待生成…')

const download = await downloadPromise
const filename = download.suggestedFilename()
console.log('下载文件名:', filename)

const savePath = `dist/${filename}`
await download.saveAs(savePath)
console.log('已保存到:', savePath)

await browser.close()

if (errors.length > 0) {
  console.log('\n=== 捕获到的错误 ===')
  errors.forEach((e) => console.log(e))
  process.exit(1)
}

console.log('\nPDF 导出成功，无 console 错误')
