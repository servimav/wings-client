import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {
  User,
  UserLogin,
  UserRegister,
  UserRole,
  UserAuthResponse
} from '@servimav/wings-services'
import { useStorage } from '@/helpers'
import { useServices } from '@/services'

const STORE_NAME = 'useUserStore'

const $service = useServices()
const $storage = useStorage<StorageType>(STORE_NAME)

export const useUserStore = defineStore(STORE_NAME, () => {
  const auth_token = ref<string>()
  const roles = ref<UserRole[]>()
  const user = ref<User>()

  /**
   * -----------------------------------------
   *	Methods
   * -----------------------------------------
   */

  /**
   * authLogin
   * @param params
   * @returns
   */
  async function authLogin(params: UserLogin) {
    const resp = (await $service.user.login(params)).data
    auth_token.value = resp.auth_token
    user.value = resp.user
    saveOnStorage()
    return resp
  }

  /**
   * authRegister
   * @param params
   * @returns
   */
  async function authRegister(params: UserRegister) {
    const resp = (await $service.user.register(params)).data
    auth_token.value = resp.auth_token
    user.value = resp.user
    saveOnStorage()
    return resp
  }

  /**
   * geMe
   */
  async function geMe() {
    user.value = (await $service.user.me()).data
  }

  /**
   * logout
   */
  async function logout() {
    user.value = undefined
    auth_token.value = undefined
    $storage.remove()
  }

  /**
   * loadFromStorage
   */
  function loadFromStorage() {
    const load = $storage.get()
    if (load) {
      auth_token.value = load.auth_token
      user.value = load.user
    }
  }

  /**
   * saveOnStorage
   */
  function saveOnStorage() {
    $storage.set({
      auth_token: auth_token.value,
      user: user.value
    })
  }

  return {
    // Data
    auth_token,
    roles,
    user,
    // Methods
    authLogin,
    authRegister,
    geMe,
    logout,
    loadFromStorage,
    saveOnStorage
  }
})

type StorageType = Partial<UserAuthResponse>
export const _userStorage = $storage
