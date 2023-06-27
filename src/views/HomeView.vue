<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTitle } from '@vueuse/core'
import { ROUTES } from '@/router'
import { useServices } from '@/services'
import { useShopStore } from '@/stores'
import type { Offer } from '@/types'
/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */
const CategorySlider = defineAsyncComponent(() => import('@/components/sliders/CategorySlider.vue'))
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

/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */
const categories = computed(() => $shop.categories)

const eventHandler = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  const scrolled = window.scrollY
  if (scrollable - scrolled <= 1) {
    getOffers()
  }
}

const loading = ref(false)
const offers = computed(() => $shop.homeOffers)
const offerCurrentPage = computed(() => $shop.homeOffersCurrentPage)
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
        page: offerCurrentPage.value ? offerCurrentPage.value + 1 : undefined,
        currency: 'CUP',
        sort: 'views'
      })
    ).data
    // if server return data
    if (resp.data.length) {
      $shop.homeOffers.push(...resp.data)
      $shop.homeOffersCurrentPage = resp.meta.current_page
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
 * -----------------------------------------
 *	Lifecycle
 * -----------------------------------------
 */

onMounted(() => {
  // set default title
  useTitle('Compras y Envíos | Wings')
  // start listening event
  window.addEventListener('scroll', eventHandler)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', eventHandler)
})
</script>

<template>
  <main class="p-2 pt-[4.8rem] pb-16 w-full container select-none">
    <!-- Main Content -->
    <div class="mb-2 px-2" v-if="offers.length">
      <template v-if="categories.length">
        <div class="text-gray-800 text-center shadow-sm bg-white p-2">
          Descubre nuestras Categorías
        </div>
        <CategorySlider :categories="categories" go-to-filter />
      </template>
      <div class="grid grid-cols-2 gap-2 mt-2">
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
    <div v-else class="grid grid-cols-2 gap-2">
      <OfferSkeleton :repeat="8" />
    </div>
    <!-- / Loading -->
  </main>
</template>
