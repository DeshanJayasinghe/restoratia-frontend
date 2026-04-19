import { http } from '@/modules/core/api/http.ts'

export function show (id: number) {
  return http.get(`/v1/newsletters/${id}`)
}

export function destroy (ids: string) {
  return http.delete(`/v1/newsletters/${ids}`)
}
