import { http } from '@/modules/core/api/http.ts'

export function getRestaurantSettings () {
  return http.get('/v1/settings/restaurant')
}

export function updateRestaurantSettings (item: Record<string, any>) {
  return http.put('/v1/settings/restaurant/update', item)
}
