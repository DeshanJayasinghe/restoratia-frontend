import { http } from '@/modules/core/api/http.ts'

export function showRestaurantCurrency (id: number) {
  return http.get(`/v1/restaurant-currencies/${id}`)
}

export function updateRestaurantCurrency (id: number, item: Record<string, any>) {
  return http.put(`/v1/restaurant-currencies/${id}`, item)
}

export function storeRestaurantCurrency (item: Record<string, any>) {
  return http.post('/v1/restaurant-currencies', item)
}
