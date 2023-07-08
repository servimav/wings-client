import { _userStorage } from '@/stores'
import initServimav from '@servimav/wings-services'
import type { TokenHandler } from '@servimav/wings-services'

function tokenHandler(): TokenHandler {
  const handler: TokenHandler = {
    getToken: () => {
      const token = _userStorage.get()
      return token ?? null
    },
    setToken(token: null | string) {
      const storage = _userStorage.get()
      _userStorage.set(token ?? undefined)
    }
  }

  return handler
}

export function useServices() {
  const apiUrl = import.meta.env.VITE_API_URL
  const appSecretKey = import.meta.env.VITE_APP_TOKEN

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
        window.location.assign('/auth')
      }
      throw error
    }
  )

  return services
}
