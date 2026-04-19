import { http } from '@/modules/core/api/http.ts'

export function show (id: number) {
  return http.get(`/v1/contact-custom-fields/${id}`)
}

export function update (id: number, item: Record<string, any>) {
  return http.put(`/v1/contact-custom-fields/${id}`, item)
}

export function store (item: Record<string, any>) {
  return http.post('/v1/contact-custom-fields', item)
}

export function getFormMeta () {
  return http.get('/v1/contact-custom-fields/form/meta')
}
