import { registerSW } from 'virtual:pwa-register'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '@/modules/core/stores/appStore.ts'
import { initApp } from './app/bootstrap/initApp'

import routes from './app/router'
import Forkiva from './Forkiva.vue'
import '@/assets/css.ts'

const app = createApp(Forkiva)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {} else {
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

await initApp({ app, router })

const appStore = useAppStore()

function buildPwaManifestUrl (): string {
  const settings = appStore.settings
  const baseUrl = import.meta.env.BASE_URL || '/'
  const appUrl = new URL(baseUrl, window.location.origin)
  const iconUrl = new URL(settings.pwa_icon || settings.logo || settings.favicon || `${baseUrl}logo.svg`, window.location.origin).href
  const fallbackIconUrl = new URL(settings.favicon || settings.logo || iconUrl, window.location.origin).href

  const manifest = {
    name: settings.pwa_name || settings.app_name,
    short_name: settings.pwa_short_name || settings.pwa_name || settings.app_name,
    description: settings.pwa_description,
    start_url: appUrl.href,
    scope: appUrl.href,
    display: 'standalone',
    background_color: settings.pwa_background_color,
    theme_color: settings.pwa_theme_color,
    icons: [
      {
        src: iconUrl,
        sizes: '192x192',
        purpose: 'any',
      },
      {
        src: iconUrl,
        sizes: '512x512',
        purpose: 'any maskable',
      },
      {
        src: fallbackIconUrl,
        sizes: '64x64',
        purpose: 'any',
      },
    ],
  }

  return `data:application/manifest+json;charset=utf-8,${encodeURIComponent(JSON.stringify(manifest))}`
}

if (appStore.settings.pwa_enabled) {
  const manifestUrl = buildPwaManifestUrl()
  const manifestLink = document.querySelector<HTMLLinkElement>('link[rel="manifest"]') || document.createElement('link')

  manifestLink.setAttribute('rel', 'manifest')
  manifestLink.setAttribute('href', manifestUrl)

  if (!manifestLink.parentNode) {
    document.head.append(manifestLink)
  }

  registerSW({ immediate: true })
} else {
  document.querySelector<HTMLLinkElement>('link[rel="manifest"]')?.remove()

  if ('serviceWorker' in navigator) {
    void navigator.serviceWorker.getRegistrations().then(registrations => {
      for (const registration of registrations) {
        void registration.unregister()
      }
    })
  }
}

app.use(router)
app.mount('#app')
