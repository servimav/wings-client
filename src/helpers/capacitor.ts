import { App } from '@capacitor/app'
import { useRouter } from 'vue-router'

export const useCapacitor = () => {
  const $router = useRouter()

  /**
   * handleBack
   */
  function backListener() {
    App.addListener('backButton', (data) => {
      console.log({ back: data })
      const previousRoute = $router.currentRoute.value
      $router.back()
      if (previousRoute !== $router.currentRoute.value) App.exitApp()
    })
  }

  /**
   * openUrlListener
   */
  function openUrlListener() {
    App.addListener('appUrlOpen', (data) => {
      $router.push(data.url)
    })
  }

  return {
    backListener,
    openUrlListener
  }
}
