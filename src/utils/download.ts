function sanitizeFilename(name: string): string {
  return name
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function downloadSvg(svg: string, filename: string): void {
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function downloadAllSvg(
  pages: Array<{ svg: string; title: string }>,
  baseName: string
): void {
  pages.forEach((page, index) => {
    setTimeout(() => {
      const number = String(index + 1).padStart(3, '0')
      downloadSvg(page.svg, `${baseName}-${number}-${sanitizeFilename(page.title)}.svg`)
    }, index * 150)
  })
}
