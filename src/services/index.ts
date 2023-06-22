import initServimav, { defaultTokenHandler } from '@servimav/wings-services'

/**
 * useServices
 * @returns
 */
export function useServices() {
  const services = initServimav({
    apiUrl: import.meta.env.VITE_API_URL,
    tokenHandler: defaultTokenHandler({}),
    appSecretKey: import.meta.env.VITE_APP_TOKEN
  })
  return services
}
