// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AppSidebar from '@/components/sidebar/AppSidebar.vue'
import SVGPreview from '@/components/preview/SVGPreview.vue'

describe('UI 组件', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('侧栏渲染 8 个主题与 A1–A5 附录项', () => {
    const wrapper = mount(AppSidebar, { global: { plugins: [createPinia()] } })

    expect(wrapper.findAll('.theme-picker button')).toHaveLength(8)
    expect(wrapper.findAll('.appendix-tag').map(node => node.text())).toEqual([
      'A1',
      'A2',
      'A3',
      'A4',
      'A5',
    ])
  })

  it('SVGPreview 无内容时显示空态文案', () => {
    const wrapper = mount(SVGPreview, { props: { svg: '', emptyText: '暂无预览' } })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('暂无预览')
  })

  it('SVGPreview 有内容时渲染带 alt 的 img', () => {
    const wrapper = mount(SVGPreview, { props: { svg: '<svg></svg>', alt: '预览' } })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('alt')).toBe('预览')
  })
})
