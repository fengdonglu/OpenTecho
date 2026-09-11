import { onMounted, onUnmounted, ref } from 'vue'

export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export type InstallOutcome = 'accepted' | 'dismissed' | 'unavailable'

/**
 * 捕获浏览器的安装提示（beforeinstallprompt），
 * 以便在界面上提供一个「安装应用」按钮。
 */
export function useInstallPrompt() {
  const canInstall = ref(false)
  let deferred: BeforeInstallPromptEvent | null = null

  function onBeforeInstall(event: Event): void {
    event.preventDefault()
    deferred = event as BeforeInstallPromptEvent
    canInstall.value = true
  }

  function onInstalled(): void {
    deferred = null
    canInstall.value = false
  }

  onMounted(() => {
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
  })

  onUnmounted(() => {
    window.removeEventListener('beforeinstallprompt', onBeforeInstall)
    window.removeEventListener('appinstalled', onInstalled)
  })

  async function promptInstall(): Promise<InstallOutcome> {
    if (!deferred) return 'unavailable'
    await deferred.prompt()
    const choice = await deferred.userChoice
    if (choice.outcome === 'accepted') {
      deferred = null
      canInstall.value = false
    }
    return choice.outcome
  }

  return { canInstall, promptInstall }
}
