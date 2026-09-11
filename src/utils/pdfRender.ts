export interface PdfPage {
  svg: string
  widthMm: number
  heightMm: number
}

export interface PdfExportOptions {
  onProgress?: (completed: number, total: number) => void
  signal?: AbortSignal
}

export interface PdfRenderer {
  render(svg: string, widthMm: number, heightMm: number): Promise<string>
}

export async function renderAllPages(
  pages: PdfPage[],
  renderer: PdfRenderer,
  options: PdfExportOptions = {}
): Promise<string[]> {
  const total = pages.length
  const images: string[] = []

  for (let i = 0; i < total; i++) {
    if (options.signal?.aborted) {
      throw new DOMException('PDF export aborted', 'AbortError')
    }
    const page = pages[i]
    images.push(await renderer.render(page.svg, page.widthMm, page.heightMm))
    options.onProgress?.(i + 1, total)
  }

  return images
}
