import { http } from '@/modules/core/api/http.ts'

export function index (params: Record<string, any> = {}) {
  return http.get('/v1/contacts', { params })
}

export function show (id: number) {
  return http.get(`/v1/contacts/${id}`)
}

export function reply (id: number, data: { message: string }) {
  return http.post(`/v1/contacts/${id}/reply`, data)
}

export function destroy (ids: string) {
  return http.delete(`/v1/contacts/${ids}`)
}
