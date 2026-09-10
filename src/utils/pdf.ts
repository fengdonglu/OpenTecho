import { jsPDF } from 'jspdf'

export interface PdfPage {
  svg: string
  widthMm: number
  heightMm: number
}

/**
 * 清洗 SVG 使其能被 <img> 可靠加载：
 * 1. 去掉 <?xml ...?> 声明
 * 2. 把 :root{--x:value} 变量内联成实际值
 * 3. 删除残留的 :root{} 定义
 */
function prepareSvg(svg: string): string {
  const vars: Record<string, string> = {}
  const rootRegex = /:root\s*\{([^}]*)\}/g
  let match: RegExpExecArray | null
  while ((match = rootRegex.exec(svg))) {
    for (const decl of match[1].split(';')) {
      const dm = decl.match(/(--[\w-]+)\s*:\s*([^;]+)/)
      if (dm) vars[dm[1]] = dm[2].trim()
    }
  }

  let result = svg.replace(/<\?xml[^?]*\?>\s*/, '')
  for (const [name, value] of Object.entries(vars)) {
    result = result.split(`var(${name})`).join(value)
  }
  result = result.replace(/:root\s*\{[^}]*\}/g, '')
  return result
}

function svgToDataUrl(svg: string): string {
  const bytes = new TextEncoder().encode(svg)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return 'data:image/svg+xml;base64,' + btoa(binary)
}

function svgToPng(svg: string, widthMm: number, heightMm: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const cleaned = prepareSvg(svg)
    const img = new Image()
    img.onload = () => {
      const scale = 200 / 25.4
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(widthMm * scale)
      canvas.height = Math.round(heightMm * scale)
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas not supported'))
        return
      }
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.9))
    }
    img.onerror = () => {
      console.error('SVG 加载失败，清洗后前 500 字符:', cleaned.slice(0, 500))
      reject(new Error('SVG render failed'))
    }
    img.src = svgToDataUrl(cleaned)
  })
}

export async function exportPdf(pages: PdfPage[], filename: string): Promise<void> {
  if (pages.length === 0) return

  const orientationOf = (w: number, h: number): 'landscape' | 'portrait' =>
    w > h ? 'landscape' : 'portrait'

  const first = pages[0]
  const pdf = new jsPDF({
    unit: 'mm',
    format: [first.widthMm, first.heightMm],
    orientation: orientationOf(first.widthMm, first.heightMm),
  })

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]
    if (i > 0) {
      pdf.addPage([page.widthMm, page.heightMm], orientationOf(page.widthMm, page.heightMm))
    }
    const dataUrl = await svgToPng(page.svg, page.widthMm, page.heightMm)
    pdf.addImage(dataUrl, 'JPEG', 0, 0, page.widthMm, page.heightMm)
  }

  pdf.save(filename)
}
