import { http } from '@/modules/core/api/http.ts'

export function show (id: number, returnAllTranslations = false) {
  return http.get(`/v1/blog-tags/${id}`, {
    params: {
      return_all_translations: returnAllTranslations,
    },
  })
}

export function update (id: number, item: Record<string, any>) {
  return http.put(`/v1/blog-tags/${id}`, item)
}

export function store (item: Record<string, any>) {
  return http.post('/v1/blog-tags', item)
}
