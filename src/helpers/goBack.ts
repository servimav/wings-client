import $router, { ROUTES } from '@/router'

/**
 * goBack
 */
export function goBack() {
  const previousRoute = $router.currentRoute.value
  $router.back()

  if (previousRoute !== $router.currentRoute.value) $router.push({ name: ROUTES.HOME })
}
