import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import {
  getBookingCalendarEvents,
  getReservationFormMeta,
  showReservation,
  storeReservation,
  updateBookingCalendarStatus,
  updateReservation,
} from '@/modules/restaurant/api/reservation.api.ts'

export function useReservation () {
  const toast = useToast()
  const { t } = useI18n()

  const getShowData = async (id: number): Promise<Record<string, any>> => {
    try {
      return { status: 200, data: (await showReservation(id)).data.body }
    } catch (error: any) {
      if (error?.response?.status !== 404) {
        toast.error(t('core::errors.an_unexpected_error_occurred'))
      }
      return { status: error?.response?.status }
    }
  }

  const getCalendarEvents = async (filters: Record<string, any> = {}) => {
    try {
      return (await getBookingCalendarEvents({ filters })).data.body || []
    } catch {
      toast.error(t('core::errors.an_unexpected_error_occurred'))
      return []
    }
  }

  const saveCalendarStatus = async (id: number, payload: Record<string, any>) => {
    try {
      await updateBookingCalendarStatus(id, payload)
      toast.success(t('admin::messages.resource_updated', { resource: t('reservation::reservations.reservation') }))
    } catch {
      toast.error(t('core::errors.an_unexpected_error_occurred'))
    }
  }

  return {
    getShowData,
    getFormMeta: getReservationFormMeta,
    store: storeReservation,
    update: updateReservation,
    getCalendarEvents,
    saveCalendarStatus,
  }
}
