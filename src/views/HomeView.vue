<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import type { ShopOffer } from '@servimav/wings-services'
import { scrollTop } from '@/helpers'
import { ROUTES } from '@/router'
import { useServices } from '@/services'
import { useShopStore } from '@/stores'
import type { Offer } from '@/types'

/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */

const AnnouncementSlider = defineAsyncComponent(
  () => import('@/components/sliders/AnnouncementSlider.vue')
)
const CategorySlider = defineAsyncComponent(() => import('@/components/sliders/CategorySlider.vue'))
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

defineOptions({
  name: 'HomeView'
})

/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */

const categories = computed(() => $shop.categories)

const eventHandler = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  const scrolled = window.scrollY
  if (scrollable - scrolled <= 10) {
    getOffers()
  }
}
const loading = ref(false)
const offers = computed<ShopOffer[]>(() => $shop.homeOffers)
const currentPage = computed<number | undefined>(() => $shop.homePagination)

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
        sort: 'views'
      })
    ).data
    $shop.homePagination = resp.meta.current_page
    // if server return data
    if (resp.data.length) {
      $shop.homeOffers.push(...resp.data)
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
 * handleOnPull
 */
async function handleOnPull(endPull: CallableFunction) {
  $shop.homePagination = undefined
  $shop.homeOffers = []
  await getOffers()
  endPull()
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
  // scroll top smoothly
  scrollTop()
  // init Data
  if (!$shop.homeOffers.length) {
    $shop.homeOffers = []
    $shop.homePagination = undefined
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
  <PullToRefresh :on-pull="handleOnPull" />
  <main class="container h-full min-h-screen w-full select-none p-2 pb-[4.5rem] pt-[4.8rem]">
    <!-- Main Content -->
    <div class="mb-2 px-2" v-if="offers.length">
      <AnnouncementSlider />

      <template v-if="categories.length">
        <!-- <div class="bg-white p-2 text-center text-gray-800 shadow-sm">
          Descubre nuestras Categorías
        </div> -->
        <CategorySlider :categories="categories" go-to-filter />
      </template>

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

    <!-- Loading Skeleton -->
    <div v-else class="grid grid-cols-2 gap-2">
      <OfferSkeleton :repeat="8" />
    </div>
    <!-- / Loading Skeleton -->
  </main>
</template>
