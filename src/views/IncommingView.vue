<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import { STOCK_TYPE, type ShopOffer } from '@servimav/wings-services'
import { scrollTop, sendWhatsappMessage } from '@/helpers'
import { ROUTES } from '@/router'
import { useServices } from '@/services'
import { useShopStore } from '@/stores'
import type { Offer } from '@/types'
/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */
const OfferSkeleton = defineAsyncComponent(() => import('@/components/widgets/OfferSkeleton.vue'))
const OfferWidget = defineAsyncComponent(() => import('@/components/widgets/OfferWidget.vue'))
/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */
const $router = useRouter()
const $service = useServices()
const $shop = useShopStore()

defineOptions({
  name: 'IncommingView'
})

/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */

const eventHandler = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  const scrolled = window.scrollY
  if (scrollable - scrolled <= 10) {
    getOffers()
  }
}
const loading = ref(false)
const offers = computed<ShopOffer[]>(() => $shop.incommingOffers)
const currentPage = computed<number | undefined>(() => $shop.incommingPagination)
/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */
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
  <main class="container w-full select-none bg-gray-50 p-2 pb-16 pt-14">
    <div class="rounded-lg border border-gray-300 bg-white p-4 dark:bg-slate-800">
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
        class="mt-4 w-full rounded-full bg-primary px-2 py-1.5 text-white"
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
