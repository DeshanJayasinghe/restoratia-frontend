import type {AppSettings, AppState, SupportedLanguages} from '@/modules/core/contracts/AppState.ts'
import {defineStore} from 'pinia'

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    settings: {
      supported_locales: ['en'],
      supported_languages: [{
        id: 'en',
        name: 'English',
      }],
      locale: 'en',
      fallback_locale: 'en',
      start_of_week: 'sunday',
      end_of_week: 'saturday',
      timezone: 'Asia/Amman',
      default_time_format: 'h:i A',
      currency: 'JOD',
      is_rtl: false,
      app_name: 'Forkiva',
      logo: null,
      logo_data_base64: null,
      favicon: null,
      default_theme_mode: 'light',
      theme_primary_color: '#F57C00',
      theme_secondary_color: '#043A63',
      theme_success_color: '#2ecc71',
      theme_info_color: '#03C3EC',
      theme_warning_color: '#f1c40f',
      theme_error_color: '#e74c3c',
      pwa_enabled: false,
      pwa_name: 'Forkiva',
      pwa_short_name: 'Forkiva',
      pwa_description: 'Forkiva restaurant POS and management system.',
      pwa_background_color: '#ffffff',
      pwa_theme_color: '#ffffff',
      pwa_icon: null,
    },
    translations: {},
    themeMode: 'light',
    currentLocale: 'en',
  }),
  getters: {
    supportedLocales: state => state.settings.supported_locales,
    supportedLanguages: state => state.settings.supported_languages,
    locale: state => state.settings.locale,
    appCurrentLocale: state => state.currentLocale,
    fallbackLocale: state => state.settings.fallback_locale,
    timezone: state => state.settings.timezone,
    currency: state => state.settings.currency,
    appName: state => state.settings.app_name,
    appTranslations: state => state.translations,
    appThemeMode: state => state.themeMode,
    currentLanguage: state => {
      return state.settings.supported_languages.find(lang => lang.id === state.currentLocale)
    },
    defaultLanguage: (state): SupportedLanguages => {
      return state.settings.supported_languages.find(lang => lang.id === state.settings.locale) as SupportedLanguages
    },
    isRtl: (state): boolean => state.settings.is_rtl,
    logo: (state): string | null => state.settings.logo,
    logoDataBase64: (state): string | null => state.settings.logo_data_base64,
    favicon: (state): string | null => state.settings.favicon,
  },
  actions: {
    restoreApp() {
      const mode = localStorage.getItem('theme_mode')
      this.themeMode = mode === 'dark' || mode === 'light' ? mode : 'light'
      this.currentLocale = localStorage.getItem('current_locale') || 'en'
    },
    setSettings(settings: AppSettings) {
      this.settings = settings
      if (!localStorage.getItem('theme_mode')) {
        this.themeMode = settings.default_theme_mode
      }

      if (!settings.supported_locales.includes(this.currentLocale)) {
        this.setCurrentLocale(settings.locale)
      }

      if (settings.logo) {
        this.setLogo(settings.logo)
      }
      if (settings.favicon) {
        useFavicon(settings.favicon)
      }
    },
    setTranslations(translations: object) {
      this.translations = translations
    },
    setThemeMode(mode: 'light' | 'dark') {
      this.themeMode = mode
      localStorage.setItem('theme_mode', mode)
    },
    setCurrentLocale(currentLocale: string) {
      this.currentLocale = currentLocale
      localStorage.setItem('current_locale', currentLocale)
    },
    setLogo(logoUrl: string) {
      localStorage.setItem('logo_url', logoUrl)
    },
  },
})
