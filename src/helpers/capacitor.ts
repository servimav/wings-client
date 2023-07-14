import { useRouter } from 'vue-router'
import { App, type URLOpenListenerEvent } from '@capacitor/app'
import { Share, type ShareOptions } from '@capacitor/share'

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
   * canShare
   * @returns
   */
  async function canShare() {
    return Share.canShare()
  }

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
   * share
   * @param options
   */
  async function share(options: ShareOptions) {
    await Share.share(options)
  }

  return {
    backListener,
    canShare,
    deepLink,
    share
  }
}
