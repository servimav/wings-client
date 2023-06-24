<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, onMounted, ref } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { useTitle } from '@vueuse/core'
import type { Offer } from '@/types'
import { useShopStore } from '@/stores'
import { ROUTES } from '@/router'
import type { ShopOfferFilter } from '@servimav/wings-services'
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
const $shop = useShopStore()

/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */

const categories = computed(() => $shop.categories)
const loading = ref(true)
const offers = computed(() => $shop.filterOffers)
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
  $shop.filterOffers = []
  try {
    await $shop.getFilterOffers(filter)
  } catch (error) {
    console.log({ error })
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

onBeforeMount(() => {
  const urlFilter = $route.query as ShopOfferFilter
  filterOffers(urlFilter)
})

onBeforeRouteUpdate((to) => {
  const urlFilter = to.query as ShopOfferFilter
  filterOffers(urlFilter)
})

onMounted(() => {
  // set default title
  useTitle('Compras y Envíos | Wings')
})
</script>

<template>
  <main class="p-2 pt-[4.8rem] pb-16 w-full container select-none">
    <div class="space-y-2 mb-2">
      <!-- Data -->
      <div class="px-2" v-if="offers.length">
        <h2 class="text-gray-800 text-lg text-center shadow-sm bg-white p-2">
          Resultados {{ title }}
        </h2>

        <div class="grid grid-cols-2 gap-2 mt-2">
          <OfferWidget
            v-for="(offer, index) in offers"
            :key="`home-view-offer-grid-example-${index}`"
            :offer="offer"
            @click="() => goToOffer(offer)"
          />
        </div>
      </div>
      <!-- / Data -->

      <!-- Loading -->
      <template v-else-if="loading">
        <h2 class="text-gray-800 text-lg text-center shadow-sm bg-white p-2">
          Buscando {{ title }}
        </h2>
        <div class="grid grid-cols-2 gap-2 mt-2">
          <OfferSkeleton :repeat="8" />
        </div>
      </template>
      <!-- / Loading -->

      <!-- No content -->
      <div v-else class="min-h-[30rem] flex items-center justify-center">
        <div class="px-4">
          <SadIcon class="w-28 h-28 mx-auto text-gray-500" />
          <p class="text-center text-gray-600 text-lg">
            No encontramos ninguna coincidencia en la búsueda {{ title }}
          </p>
        </div>
      </div>
      <!-- /  No content  -->
    </div>
  </main>
</template>
