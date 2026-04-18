import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import {
  getChefFormMeta,
  showChef,
  storeChef,
  updateChef,
} from '@/modules/restaurant/api/chef.api.ts'

export function useChef () {
  const toast = useToast()
  const { t } = useI18n()

  const getShowData = async (id: number): Promise<Record<string, any>> => {
    try {
      return { status: 200, data: (await showChef(id)).data.body }
    } catch (error: any) {
      if (error?.response?.status !== 404) {
        toast.error(t('core::errors.an_unexpected_error_occurred'))
      }
      return { status: error?.response?.status }
    }
  }

  return {
    getShowData,
    getFormMeta: getChefFormMeta,
    store: storeChef,
    update: updateChef,
  }
}
