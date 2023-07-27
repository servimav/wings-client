<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import { STOCK_TYPE, type ShopOffer } from '@servimav/wings-services'
import { scrollTop, sendWhatsappMessage, useCapacitor } from '@/helpers'
import { ROUTES } from '@/router'
import { useServices } from '@/services'
import { useAppStore, useShopStore } from '@/stores'
import type { Offer } from '@/types'
import { initAccordions } from 'flowbite'

/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */

const ChevronUp = defineAsyncComponent(() => import('@/components/icons/ChevronUp.vue'))
const OfferSkeleton = defineAsyncComponent(() => import('@/components/skeletons/OfferSkeleton.vue'))
const OfferWidget = defineAsyncComponent(() => import('@/components/widgets/OfferWidget.vue'))
const PullToRefresh = defineAsyncComponent(() => import('@/components/PullToRefresh.vue'))

/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */

const $app = useAppStore()
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
    $app.axiosError(error, 'No se pudo obtener los datos')
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

onMounted(() =>
  setTimeout(() => {
    initAccordions()
  }, 1000)
)
</script>

<template>
  <PullToRefresh v-if="IS_PLATAFORM_MOBILE" :on-pull="handlePullToRefresh" />
  <main class="container h-full min-h-screen w-full select-none bg-gray-50 p-2 pb-[4.5rem] pt-16">
    <div id="accordion-collapse-custom-order" data-accordion="collapse" class="px-2">
      <!-- Title -->
      <h2 id="accordion-collapse-custom-order-heading">
        <button
          type="button"
          class="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-5 text-left text-gray-500 aria-expanded:rounded-b-none aria-expanded:border-b-0 aria-expanded:bg-white"
          data-accordion-target="#accordion-collapse-custom-order-body"
          aria-controls="aaccordion-collapse-custom-order-body"
        >
          ¿No encuentras lo que buscas?
          <ChevronUp data-accordion-icon class="h-5 w-5 shrink-0" aria-hidden="true" />
        </button>
      </h2>
      <!-- / Title  -->

      <!-- Body -->
      <div
        id="accordion-collapse-custom-order-body"
        class="hidden"
        aria-labelledby="accordion-collapse-custom-order-heading"
      >
        <div class="rounded-b-xl border-x border-b border-gray-200 bg-white px-5 pb-5">
          <p class="mb-2 text-gray-500">
            Si desea adquirir un producto que no esté en nuestra tienda puede hacer un "Encargo
            Personalizado"
          </p>
          <p class="mb-4 text-gray-500">
            Contáctenos y denos los detalles del producto que necesita. Puede darnos Fotos, Enlaces
            o describirnos qué quiere comprar y nosotros le buscaremos las mejores ofertas
          </p>

          <button @click="contactForIncomming" class="btn btn-md btn-primary w-full">
            Solicitar encargo
          </button>
        </div>
      </div>
      <!-- / Body -->
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
