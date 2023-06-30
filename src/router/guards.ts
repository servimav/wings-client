import { useUserStore } from '@/stores'
import type { NavigationGuard } from 'vue-router'
import { ROUTES } from './names'

export const authGuard: NavigationGuard = (to, from, $next) => {
  const $user = useUserStore()

  if ($user.auth_token) {
    $next()
  } else {
    $next({
      name: ROUTES.LOGIN
    })
  }
}
