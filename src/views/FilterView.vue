<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { useTitle } from '@vueuse/core'
import type { ShopOffer, ShopOfferFilter } from '@servimav/wings-services'
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
const CategorySlider = defineAsyncComponent(() => import('@/components/sliders/CategorySlider.vue'))
const OfferSkeleton = defineAsyncComponent(() => import('@/components/widgets/OfferSkeleton.vue'))
const OfferWidget = defineAsyncComponent(() => import('@/components/widgets/OfferWidget.vue'))
const SadIcon = defineAsyncComponent(() => import('@/components/icons/SadOutline.vue'))
/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */
const $route = useRoute()
const $router = useRouter()
const $service = useServices()
const $shop = useShopStore()

/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */
const categories = computed(() => $shop.categories)
const loading = ref(false)
const offers = ref<ShopOffer[]>([])
const offersCurrentPage = ref<number>()

const scrollEventHandler = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  const scrolled = window.scrollY
  if (scrollable - scrolled <= 1) {
    const urlFilter = $route.query as ShopOfferFilter
    filterOffers(urlFilter)
  }
}

const title = ref<string>()

/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */

/**
 * filterOffers
 * @param filter
 */
async function filterOffers(filter: ShopOfferFilter) {
  title.value = filter.search ? `de "${filter.search?.toLocaleUpperCase()}"` : ''
  loading.value = true
  try {
    const resp = (
      await $service.shop.offer.filter({
        ...filter,
        page: offersCurrentPage.value ? offersCurrentPage.value + 1 : undefined
      })
    ).data
    if (resp.data.length) {
      offers.value.push(...resp.data)
      offersCurrentPage.value = resp.meta.current_page
    } else {
      window.removeEventListener('scroll', scrollEventHandler)
    }
  } catch (error) {
    console.log({ error })
    window.removeEventListener('scroll', scrollEventHandler)
  }
  loading.value = false
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
 * -----------------------------------------
 *	Lifecycle
 * -----------------------------------------
 */

onBeforeRouteUpdate((to) => {
  scrollTop()
  const urlFilter = to.query as ShopOfferFilter
  // init offers and pagination
  offers.value = []
  offersCurrentPage.value = undefined
  filterOffers(urlFilter)
})

onMounted(async () => {
  // set default title
  useTitle('Compras y Envíos | Wings')
  // init offers and pagination
  scrollTop()
  offers.value = []
  offersCurrentPage.value = undefined
  // start filter
  const urlFilter = $route.query as ShopOfferFilter
  await filterOffers(urlFilter)
  // init scroll event
  window.addEventListener('scroll', scrollEventHandler)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', scrollEventHandler)
})
</script>

<template>
  <main class="container w-full select-none p-2 pb-16 pt-[4.8rem]">
    <div class="mb-2 space-y-2">
      <div class="px-2" v-if="categories.length">
        <div class="bg-white p-2 text-center text-gray-800 shadow-sm">Categorías</div>
        <CategorySlider :categories="categories" go-to-filter />
      </div>

      <!-- Data -->
      <div class="px-2" v-if="offers.length">
        <h2 class="bg-white p-2 text-center text-lg text-gray-800 shadow-sm">
          Resultados {{ title }}
        </h2>

        <div class="mt-2 grid grid-cols-2 gap-2">
          <OfferWidget
            v-for="(offer, index) in offers"
            :key="`home-view-offer-grid-example-${index}`"
            :offer="offer"
            @click="() => goToOffer(offer)"
          />

          <OfferSkeleton :repeat="8" v-if="loading" />
        </div>

        <div class="mt-2" v-if="categories.length">
          <CategorySlider :categories="categories" go-to-filter />
        </div>
      </div>
      <!-- / Data -->

      <!-- Loading -->
      <template v-else-if="loading">
        <h2 class="bg-white p-2 text-center text-lg text-gray-800 shadow-sm">
          Buscando {{ title }}
        </h2>
        <div class="mt-2 grid grid-cols-2 gap-2">
          <OfferSkeleton :repeat="8" />
        </div>
      </template>
      <!-- / Loading -->

      <!-- No content -->
      <div v-else class="flex min-h-[30rem] items-center justify-center">
        <div class="px-4">
          <SadIcon class="mx-auto h-28 w-28 text-gray-500" />
          <p class="text-center text-lg text-gray-600">
            No encontramos ninguna coincidencia en la búsueda {{ title }}
          </p>
        </div>
      </div>
      <!-- /  No content  -->
    </div>
  </main>
</template>
