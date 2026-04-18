import type {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
  RouteLocationRaw,
} from 'vue-router'
import { useAuth } from '@/modules/auth/composables/auth.ts'

export function authMiddleware (to: RouteLocationNormalized, from: RouteLocationNormalizedLoaded, next: NavigationGuardNext) {
  const auth = useAuth()

  if (!auth.store.getToken) {
    auth.store.restoreAuth()
  }

  if (auth.store.isAuthenticated) {
    next()
  } else {
    next({ name: 'auth.login' } as unknown as RouteLocationRaw)
  }
}
