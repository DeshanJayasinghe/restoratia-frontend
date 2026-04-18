import { http } from '@/modules/core/api/http.ts'

export function getBlogReport () {
  return http.get('/v1/blog-reports')
}
