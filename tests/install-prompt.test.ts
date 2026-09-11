// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { useInstallPrompt } from '@/composables/useInstallPrompt'

type PromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function makePromptEvent(outcome: 'accepted' | 'dismissed'): PromptEvent {
  const event = new Event('beforeinstallprompt') as PromptEvent
  event.prompt = vi.fn().mockResolvedValue(undefined)
  event.userChoice = Promise.resolve({ outcome })
  return event
}

const Harness = defineComponent({
  setup() {
    const { canInstall, promptInstall } = useInstallPrompt()
    return { canInstall, promptInstall }
  },
  template: '<div><span v-if="canInstall">installable</span></div>',
})

describe('useInstallPrompt', () => {
  it('收到 beforeinstallprompt 后变为可安装', async () => {
    const wrapper = mount(Harness)
    expect(wrapper.text()).not.toContain('installable')

    window.dispatchEvent(makePromptEvent('accepted'))
    await nextTick()

    expect(wrapper.text()).toContain('installable')
    wrapper.unmount()
  })

  it('安装被接受后不再显示可安装', async () => {
    const wrapper = mount(Harness)
    const event = makePromptEvent('accepted')
    window.dispatchEvent(event)
    await nextTick()

    const outcome = await (wrapper.vm as unknown as {
      promptInstall: () => Promise<string>
    }).promptInstall()

    expect(event.prompt).toHaveBeenCalled()
    expect(outcome).toBe('accepted')
    await nextTick()
    expect(wrapper.text()).not.toContain('installable')
    wrapper.unmount()
  })

  it('没有可用事件时返回 unavailable', async () => {
    const wrapper = mount(Harness)
    const outcome = await (wrapper.vm as unknown as {
      promptInstall: () => Promise<string>
    }).promptInstall()

    expect(outcome).toBe('unavailable')
    wrapper.unmount()
  })
})
