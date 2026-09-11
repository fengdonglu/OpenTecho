import { describe, expect, it } from 'vitest'
import { renderAllPages } from '@/utils/pdfRender'
import type { PdfPage, PdfRenderer } from '@/utils/pdfRender'

const pages: PdfPage[] = [
  { svg: '<svg/>', widthMm: 250, heightMm: 176 },
  { svg: '<svg/>', widthMm: 250, heightMm: 176 },
  { svg: '<svg/>', widthMm: 125, heightMm: 176 },
]

describe('PDF 分页渲染', () => {
  it('按顺序渲染全部页面并报告进度', async () => {
    const progress: number[] = []
    const renderer: PdfRenderer = { render: async () => 'data' }

    const images = await renderAllPages(pages, renderer, {
      onProgress: (done) => progress.push(done),
    })

    expect(images).toEqual(['data', 'data', 'data'])
    expect(progress).toEqual([1, 2, 3])
  })

  it('中止后停止渲染并抛出错误', async () => {
    const controller = new AbortController()
    let count = 0
    const renderer: PdfRenderer = {
      render: async () => {
        count++
        controller.abort()
        return 'data'
      },
    }

    await expect(
      renderAllPages(pages, renderer, { signal: controller.signal })
    ).rejects.toThrow()
    expect(count).toBe(1)
  })
})
