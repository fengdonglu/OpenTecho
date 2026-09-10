import type { PageDimensions, ThemeConfig } from '@/types'

export type SvgAttrs = Record<string, string | number | undefined>

export function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function serializeAttrs(attrs: SvgAttrs): string {
  return Object.entries(attrs)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}="${typeof v === 'number' ? v : esc(String(v))}"`)
    .join(' ')
}

export function openTag(name: string, attrs: SvgAttrs = {}, selfClosing = false): string {
  const serialized = serializeAttrs(attrs)
  return selfClosing ? `<${name} ${serialized}/>` : `<${name} ${serialized}>`
}

export function closeTag(name: string): string {
  return `</${name}>`
}

export function rect(attrs: SvgAttrs): string {
  return openTag('rect', attrs, true)
}

export function line(attrs: SvgAttrs): string {
  return openTag('line', attrs, true)
}

export function circle(attrs: SvgAttrs): string {
  return openTag('circle', attrs, true)
}

export function path(d: string, attrs: SvgAttrs = {}): string {
  return openTag('path', { d, ...attrs }, true)
}

export function text(content: string, attrs: SvgAttrs = {}): string {
  return `${openTag('text', attrs)}${esc(content)}${closeTag('text')}`
}

export function group(content: string, attrs: SvgAttrs = {}): string {
  return `${openTag('g', attrs)}${content}${closeTag('g')}`
}

export function themeStyle(theme: ThemeConfig): string {
  const css = [
    `--ink:${theme.ink}`,
    `--muted:${theme.muted}`,
    `--accent:${theme.accent}`,
    `--line:${theme.line}`,
    `--hair:${theme.hair}`,
    `--grid-dot-color:${theme.gridDotColor}`,
    `--grid-dot-opacity:${theme.gridDotOpacity}`,
    `--grid-mid-color:${theme.gridMidColor}`,
    `--grid-mid-opacity:${theme.gridMidOpacity}`,
    `--grid-mid-width:${theme.gridMidWidth}`,
    `--grid-major-color:${theme.gridMajorColor}`,
    `--grid-major-opacity:${theme.gridMajorOpacity}`,
    `--grid-major-width:${theme.gridMajorWidth}`,
  ].join(';')
  return `<style>:root{${css}}</style>`
}

export function gridDefs(): string {
  const dots = `<pattern id="dots-fine" patternUnits="userSpaceOnUse" width="2" height="2">${circle({ cx: 0, cy: 0, r: 0.25, fill: 'var(--grid-dot-color)', 'fill-opacity': 'var(--grid-dot-opacity)' })}</pattern>`
  const mid = `<pattern id="grid-mid" patternUnits="userSpaceOnUse" width="5" height="5">${path('M0 0 H5 M0 0 V5', { stroke: 'var(--grid-mid-color)', 'stroke-opacity': 'var(--grid-mid-opacity)', 'stroke-width': 'var(--grid-mid-width)' })}</pattern>`
  const major = `<pattern id="grid-major" patternUnits="userSpaceOnUse" width="10" height="10">${path('M0 0 H10 M0 0 V10', { stroke: 'var(--grid-major-color)', 'stroke-opacity': 'var(--grid-major-opacity)', 'stroke-width': 'var(--grid-major-width)' })}</pattern>`
  return dots + mid + major
}

export function backgroundGrid(dimensions: PageDimensions, theme: ThemeConfig): string {
  const { width, height } = dimensions
  return (
    rect({ x: 0, y: 0, width, height, fill: theme.background }) +
    rect({ x: 0, y: 0, width, height, fill: 'url(#dots-fine)' }) +
    rect({ x: 0, y: 0, width, height, fill: 'url(#grid-mid)' }) +
    rect({ x: 0, y: 0, width, height, fill: 'url(#grid-major)' })
  )
}

export function svgDocument(dimensions: PageDimensions, theme: ThemeConfig, body: string): string {
  const { width, height } = dimensions
  const defs = themeStyle(theme) + gridDefs()
  return (
    `<?xml version="1.0" encoding="UTF-8"?>` +
    openTag('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: `${width}mm`,
      height: `${height}mm`,
      viewBox: `0 0 ${width} ${height}`,
    }) +
    openTag('defs') +
    defs +
    closeTag('defs') +
    body +
    closeTag('svg')
  )
}
