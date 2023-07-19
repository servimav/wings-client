<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import { STOCK_TYPE, type ShopOffer } from '@servimav/wings-services'
import { scrollTop, sendWhatsappMessage, useCapacitor } from '@/helpers'
import { ROUTES } from '@/router'
import { useServices } from '@/services'
import { useShopStore } from '@/stores'
import type { Offer } from '@/types'

/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */

const OfferSkeleton = defineAsyncComponent(() => import('@/components/skeletons/OfferSkeleton.vue'))
const OfferWidget = defineAsyncComponent(() => import('@/components/widgets/OfferWidget.vue'))
const PullToRefresh = defineAsyncComponent(() => import('@/components/PullToRefresh.vue'))

/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */

const $router = useRouter()
const $service = useServices()
const $shop = useShopStore()
const $capacitor = useCapacitor()

defineOptions({
  name: 'IncommingView'
})

/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */

const loading = ref(false)
const offers = computed<ShopOffer[]>(() => $shop.incommingOffers)
const currentPage = computed<number | undefined>(() => $shop.incommingPagination)
const IS_PLATAFORM_MOBILE = $capacitor.platform() !== 'web'

/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */

/**
 * handlePullToRefresh
 */
async function handlePullToRefresh(endPull: CallableFunction) {
  $shop.incommingPagination = undefined
  $shop.incommingOffers = []
  getOffers()
  endPull()
}

/**
 * eventHandler
 */
const eventHandler = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  const scrolled = window.scrollY
  if (scrollable - scrolled <= 10) {
    getOffers()
  }
}

/**
 * go to single offer page
 * @param offer
 */
function goToOffer(offer: Offer) {
  void $router.push({
    name: ROUTES.SINGLE_OFFER,
    params: {
      offerId: offer.id
    }
  })
}

/**
 * getOffers
 */
async function getOffers() {
  if (loading.value) return

  loading.value = true
  try {
    const resp = (
      await $service.shop.offer.filter({
        page: currentPage.value ? currentPage.value + 1 : undefined,
        currency: 'CUP',
        sort: 'views',
        stock: STOCK_TYPE.INCOMMING
      })
    ).data
    $shop.incommingPagination = resp.meta.current_page
    // if server return data
    if (resp.data.length) {
      $shop.incommingOffers.push(...resp.data)
    } else {
      // if no more data stop event
      window.removeEventListener('scroll', eventHandler)
    }
  } catch (error) {
    console.log({ error })
    // stop event
    window.removeEventListener('scroll', eventHandler)
  }
  loading.value = false
}

/**
 * contactForIncomming
 */
function contactForIncomming() {
  const message = 'Hola, me interesa hacer un Encargo Personalizado'
  sendWhatsappMessage({ message })
}
/**
 * -----------------------------------------
 *	Lifecycle
 * -----------------------------------------
 */

onBeforeMount(async () => {
  // set default title
  useHead({
    title: 'Compras y Envíos | Wings'
  })
  scrollTop()
  // init Data
  if (!$shop.homeOffers.length) {
    $shop.incommingOffers = []
    $shop.incommingPagination = undefined
  }
  // start get offer
  await getOffers()
  // start listening event
  window.addEventListener('scroll', eventHandler)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', eventHandler)
})
</script>

<template>
  <PullToRefresh v-if="IS_PLATAFORM_MOBILE" :on-pull="handlePullToRefresh" />

  <main class="container h-full min-h-screen w-full select-none bg-gray-50 p-2 pb-[4.5rem] pt-16">
    <div class="rounded-lg border border-gray-200 bg-white p-4 text-gray-500">
      <div class="space-y-2">
        <p>
          Si desea adquirir un producto que no esté en nuestra tienda puede hacer un "Encargo
          Personalizado"
        </p>
        <p>
          Contáctenos y denos los detalles del producto que necesita. Puede darnos Fotos, Enlaces o
          describirnos qué quiere comprar y nosotros le buscaremos las mejores ofertas
        </p>
      </div>
      <button
        @click="contactForIncomming"
        class="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-primary px-5 py-2 text-lg font-medium text-white transition-colors hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary-light focus:ring-offset-1"
      >
        Solicitar encargo
      </button>
    </div>

    <!-- Main Content -->
    <div class="mb-2 mt-2 px-2" v-if="offers.length">
      <div class="mt-2 grid grid-cols-2 gap-2">
        <OfferWidget
          v-for="(offer, index) in offers"
          :key="`home-view-offer-grid-${index}`"
          :offer="offer"
          @click="() => goToOffer(offer)"
        />
        <OfferSkeleton :repeat="4" v-if="loading" />
      </div>
    </div>
    <!-- / Main Content -->

    <!-- Loading -->
    <div v-else class="mt-2 grid grid-cols-2 gap-2">
      <OfferSkeleton :repeat="4" />
    </div>
    <!-- / Loading -->
  </main>
</template>
