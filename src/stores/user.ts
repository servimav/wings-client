import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User, UserLogin, UserRegister, UserRole } from '@servimav/wings-services'
import { useStorage } from '@/helpers'
import { useServices } from '@/services'

const STORE_NAME = 'useUserStore'

const $storage = useStorage<string | undefined>(STORE_NAME)

export const useUserStore = defineStore(STORE_NAME, () => {
  const $service = useServices()

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
    user.value = resp.data
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
    user.value = resp.data
    saveOnStorage()
    return resp
  }

  /**
   * geMe
   */
  async function geMe() {
    if (auth_token.value) {
      user.value = (await $service.user.me()).data
    }
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
    auth_token.value = $storage.get() ?? undefined
  }

  /**
   * saveOnStorage
   */
  function saveOnStorage() {
    $storage.set(auth_token.value)
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

export const _userStorage = $storage
