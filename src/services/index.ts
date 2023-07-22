import { useRouter } from 'vue-router'
import { _userStorage } from '@/stores'
import initServimav from '@servimav/wings-services'
import type { TokenHandler } from '@servimav/wings-services'
import { ROUTES } from '@/router'

function tokenHandler(): TokenHandler {
  const handler: TokenHandler = {
    getToken: () => {
      const token = _userStorage.get()
      return token ?? null
    },
    setToken(token: null | string) {
      _userStorage.set(token ?? undefined)
    }
  }

  return handler
}

export function useServices() {
  const apiUrl = import.meta.env.VITE_API_URL
  const appSecretKey = import.meta.env.VITE_APP_TOKEN
  const $router = useRouter()

  const services = initServimav({
    apiUrl,
    tokenHandler: tokenHandler(),
    appSecretKey
  })

  services.api.interceptors.response.use(
    (resp) => resp,
    (error) => {
      if (error.response.status === 401) {
        _userStorage.remove()
        $router.push({ name: ROUTES.LOGIN })
      }
      throw error
    }
  )

  return services
}
