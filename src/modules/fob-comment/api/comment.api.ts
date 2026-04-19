import { http } from '@/modules/core/api/http.ts'

export function show (id: number) {
  return http.get(`/v1/comments/${id}`)
}

export function updateStatus (id: number, status: string) {
  return http.patch(`/v1/comments/${id}/status`, { status })
}
