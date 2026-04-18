import type { App } from 'vue'
import type { Router } from 'vue-router'

import { setupI18n, setupToast, setupVuetify } from '@/app/plugins'
import { check } from '@/modules/auth/api/auth.api.ts'
import { useAuthStore } from '@/modules/auth/stores/authStore.ts'
import EnglishNumbersWithDecimal from '@/modules/core/directives/english-numbers-with-decimal.ts'
import EnglishNumbers from '@/modules/core/directives/english-numbers.ts'
import { setupStore } from '@/modules/core/stores'
import { useAppStore } from '@/modules/core/stores/appStore.ts'
import { getAppSettings } from '@/modules/setting/api/setting.api.ts'
import { getAppTranslations } from '@/modules/translation/api/translation.api.ts'
import './collectModules'

interface InitAppOptions {
  app: App
  router: Router
}

export async function initApp (_: InitAppOptions): Promise<void> {
  setupStore(_.app)

  _.app.directive('integer-en', EnglishNumbers)
  _.app.directive('decimal-en', EnglishNumbersWithDecimal)

  const appStore = useAppStore()
  appStore.restoreApp()

  try {
    const [settingsResponse, translationsResponse] = await Promise.all([
      getAppSettings(),
      getAppTranslations(),
    ])

    appStore.setSettings(settingsResponse.data.body)
    appStore.setTranslations(translationsResponse.data.body)
  } catch {
    console.error('Failed to retrieve app.')
  }

  setupI18n(_.app)
  setupVuetify(_.app)
  setupToast(_.app)

  const authStore = useAuthStore()
  authStore.restoreAuth()

  while (authStore.isAuthenticated) {
    try {
      const response = await check()
      authStore.setUser(response.data.body.user)
      break
    } catch {
      authStore.logout()
    }
  }
}
