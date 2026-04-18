import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import {
  getRestaurantSettings,
  updateRestaurantSettings,
} from '@/modules/restaurant/api/restaurantSetting.api.ts'

export function useRestaurantSetting () {
  const toast = useToast()
  const { t } = useI18n()

  const load = async () => {
    try {
      const response = await getRestaurantSettings()
      return response.data.body?.settings || {}
    } catch {
      toast.error(t('core::errors.an_unexpected_error_occurred'))
      return {}
    }
  }

  const save = (payload: Record<string, any>) => updateRestaurantSettings(payload)

  return { load, save }
}
