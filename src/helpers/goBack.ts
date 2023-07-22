import $router, { ROUTES } from '@/router'

/**
 * goBack
 */
export function goBack() {
  const previousRoute = $router.currentRoute.value
  $router.back()

  if (previousRoute.fullPath === $router.currentRoute.value.fullPath)
    $router.push({ name: ROUTES.HOME })
}
