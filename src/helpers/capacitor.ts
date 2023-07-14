import { App, type URLOpenListenerEvent } from '@capacitor/app'
import { useRouter } from 'vue-router'

export const useCapacitor = () => {
  const $router = useRouter()

  /**
   * deepLink
   */
  function deepLink() {
    // Deep Link
    App.addListener('appUrlOpen', function (event: URLOpenListenerEvent) {
      // Example url: https://beerswift.app/tabs/tabs2
      // slug = /tabs/tabs2
      const slug = event.url.split('.com').pop()

      // We only push to the route if there is a slug present
      if (slug) {
        $router.push({
          path: slug
        })
      }
    })
  }

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

  return {
    deepLink,
    backListener
  }
}
