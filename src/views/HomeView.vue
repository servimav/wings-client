<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { ShopCategory } from '@servimav/wings-services'
import type { Offer } from '@/types'
import { useServices } from '@/services'
import { ROUTES } from '@/router'
/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */
const CategorySlider = defineAsyncComponent(() => import('@/components/sliders/CategorySlider.vue'))
const OfferAdvancedWidget = defineAsyncComponent(
  () => import('@/components/widgets/OfferAdvancedWidget.vue')
)
const OfferSlider = defineAsyncComponent(() => import('@/components/sliders/OfferSlider.vue'))
const OfferWidget = defineAsyncComponent(() => import('@/components/widgets/OfferWidget.vue'))
/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */
const $router = useRouter()
const $service = useServices()

/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */

const categories = ref<ShopCategory[]>([])
const offers = ref<Offer[]>([])

const offersNew = computed(() => offers.value.slice(0, 6))
const offersPromo = computed(() => offers.value.slice(6, 12))
const offersTrending = computed(() => offers.value.slice(10, 13))
const offersExtra = computed(() => offers.value.slice(13, 21))
/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */

/**
 * getCategories
 */
async function getCategories() {
  const resp = (await $service.shop.category.list()).data
  categories.value = resp
}

/**
 * getOffers
 */
async function getOffers() {
  const resp = (await $service.shop.offer.filter({ currency: 'CUP' })).data
  offers.value = resp.data
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

onBeforeMount(async () => {
  try {
    Promise.all([getOffers(), getCategories()])
  } catch (error) {
    console.log({ error })
  }
})
</script>

<template>
  <main class="p-2 pt-[4.8rem] pb-16 w-full container">
    <div class="space-y-2 mb-2">
      <div class="px-2" v-if="offersNew.length">
        <div class="text-gray-800 text-center shadow-sm bg-white p-2">Ofertas Nuevas</div>
        <OfferSlider
          :offers="offersNew"
          @click-on-offer="(offer) => goToOffer(offer)"
          class="mt-2"
        />
      </div>

      <div class="px-2" v-if="categories.length">
        <div class="text-gray-800 text-center shadow-sm bg-white p-2">
          Descubre nuestras Categorías
        </div>
        <CategorySlider :categories="categories" />
      </div>

      <div class="px-2" v-if="offersPromo.length">
        <div class="text-gray-800 text-center shadow-sm bg-white p-2">Promociones de Hoy</div>

        <div class="grid grid-cols-2 gap-2 mt-2">
          <OfferWidget
            v-for="(offer, index) in offersPromo"
            :key="`home-view-offer-grid-example-${index}`"
            :offer="offer"
            @click="() => goToOffer(offer)"
          />
        </div>
      </div>

      <div class="px-2" v-if="offersTrending.length">
        <div class="text-gray-800 text-center shadow-sm bg-white p-2">En Tendencia</div>

        <div class="flex-col space-y-2 mt-2">
          <OfferAdvancedWidget
            v-for="(offer, index) in offersTrending"
            :key="`home-view-offer-grid-example-${index}`"
            :offer="offer"
            @click="() => goToOffer(offer)"
          />
        </div>
      </div>

      <div class="px-2" v-if="categories.length">
        <CategorySlider :categories="categories" />
      </div>

      <div class="px-2" v-if="offersExtra.length">
        <div class="text-gray-800 text-center shadow-sm bg-white p-2">Ofertas</div>

        <div class="grid grid-cols-2 gap-2 mt-2">
          <OfferWidget
            v-for="(offer, index) in offersExtra"
            :key="`home-view-offer-grid-example-${index}`"
            :offer="offer"
            @click="() => goToOffer(offer)"
          />
        </div>
      </div>
    </div>
  </main>
</template>
