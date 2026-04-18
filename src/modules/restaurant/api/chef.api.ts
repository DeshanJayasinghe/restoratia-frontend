import { http } from '@/modules/core/api/http.ts'

export function showChef (id: number) {
  return http.get(`/v1/chefs/${id}`)
}

export function updateChef (id: number, item: Record<string, any>) {
  return http.put(`/v1/chefs/${id}`, item)
}

export function storeChef (item: Record<string, any>) {
  return http.post('/v1/chefs', item)
}

export function getChefFormMeta () {
  return http.get('/v1/chefs/form/meta')
}
