import { http } from '@/modules/core/api/http.ts'

export function showReservation (id: number) {
  return http.get(`/v1/reservations/${id}`)
}

export function updateReservation (id: number, item: Record<string, any>) {
  return http.put(`/v1/reservations/${id}`, item)
}

export function storeReservation (item: Record<string, any>) {
  return http.post('/v1/reservations', item)
}

export function getReservationFormMeta () {
  return http.get('/v1/reservations/form/meta')
}

export function getBookingCalendarEvents (params: Record<string, any> = {}) {
  return http.get('/v1/booking-calendar/events', { params })
}

export function updateBookingCalendarStatus (id: number, item: Record<string, any>) {
  return http.patch(`/v1/booking-calendar/${id}/status`, item)
}
