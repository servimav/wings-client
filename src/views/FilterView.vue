<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import type { ShopOffer, ShopOfferFilter } from '@servimav/wings-services'
import { scrollTop, TITLE } from '@/helpers'
import { ROUTES } from '@/router'
import { useServices } from '@/services'
import { useAppStore, useShopStore } from '@/stores'
import type { Offer } from '@/types'

/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */

const CategorySlider = defineAsyncComponent(() => import('@/components/sliders/CategorySlider.vue'))
const OfferSkeleton = defineAsyncComponent(() => import('@/components/skeletons/OfferSkeleton.vue'))
const OfferWidget = defineAsyncComponent(() => import('@/components/widgets/OfferWidget.vue'))
const SearchLoop = defineAsyncComponent(() => import('@/components/icons/SearchLoop.vue'))

/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */

const $app = useAppStore()
const $route = useRoute()
const $router = useRouter()
const $service = useServices()
const $shop = useShopStore()

/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */

const filterText = ref<string>()
const categories = computed(() => $shop.categories)
const loading = ref(false)
const offers = ref<ShopOffer[]>([])
const offersCurrentPage = ref<number>()

const searchLabel = computed(() => {
  const urlFilter = $route.query as ShopOfferFilter
  if (filterText.value !== '') {
    return filterText.value
  } else if (urlFilter.category_id) {
    return categories.value
      .filter((item) => item.id == urlFilter.category_id)[0]
      .name.toLocaleUpperCase()
  } else {
    return ''
  }
})

/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */

/**
 * scrollEventHandler
 */
const scrollEventHandler = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  const scrolled = window.scrollY
  if (scrollable - scrolled <= 1) {
    const urlFilter = $route.query as ShopOfferFilter
    filterOffers(urlFilter)
  }
}

/**
 * filterOffers
 * @param filter
 */
async function filterOffers(filter: ShopOfferFilter) {
  filterText.value = filter.search ? filter.search?.toLocaleUpperCase() : ''
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
    $app.axiosError(error, 'Error al filtrar datos')
    window.removeEventListener('scroll', scrollEventHandler)
  }
  loading.value = false
}

/**
 * goToOffer
 * @description go to single offer page
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

onMounted(async () => {
  // set default title
  useHead({
    title: TITLE.MAIN
  })

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

onBeforeRouteUpdate((to) => {
  scrollTop()
  const urlFilter = to.query as ShopOfferFilter

  // init offers and pagination
  offers.value = []
  offersCurrentPage.value = undefined
  filterOffers(urlFilter)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', scrollEventHandler)
})
</script>

<template>
  <main
    class="container h-full min-h-screen w-full select-none p-2 pb-16 pt-[4.5rem]"
    :class="{ 'flex flex-col justify-center': !offers.length }"
  >
    <div v-if="loading || offers.length" class="mb-2">
      <div class="mb-2 px-2" v-if="categories.length">
        <CategorySlider :categories="categories" go-to-filter />
      </div>
      <!-- Loading -->
      <template v-if="loading">
        <h2 class="mb-3 text-center text-lg text-gray-800">Buscando "{{ searchLabel }}"</h2>
        <div class="mt-2 grid grid-cols-2 gap-2">
          <OfferSkeleton :repeat="8" />
        </div>
      </template>
      <!-- / Loading -->

      <!-- Search Content -->
      <div v-else-if="offers.length" class="px-2">
        <h3 class="text-center text-lg text-gray-800">Resultados de "{{ searchLabel }}"</h3>

        <div class="mt-2 grid grid-cols-2 gap-2">
          <OfferWidget
            v-for="(offer, offerIndex) in offers"
            :key="`filter-view-grid-offer-${offerIndex}`"
            :offer="offer"
            @click="() => goToOffer(offer)"
          />

          <OfferSkeleton :repeat="8" v-if="loading" />
        </div>
      </div>
      <!-- / Search Content -->
    </div>

    <!-- Not Found -->
    <div v-else class="text-center">
      <div class="mb-8">
        <SearchLoop class="mx-auto h-28 w-28 text-gray-500" />
      </div>
      <div class="mb-5">
        <h3 class="mb-3 text-2xl font-medium text-gray-800">No se encuentra "{{ filterText }}"</h3>
        <p class="mx-auto max-w-xs text-gray-500">
          No encontramos coincidencias, revisa nuestras categorías y encargos para otros productos.
        </p>
      </div>
      <button
        type="button"
        @click="$router.push({ name: ROUTES.HOME })"
        class="btn btn-md btn-primary"
      >
        Explorar encargos
      </button>
    </div>
    <!-- / Not Found -->
  </main>
</template>
