<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTitle } from '@vueuse/core'
import type { Offer } from '@/types'
import { useShopStore } from '@/stores'
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
const $shop = useShopStore()

/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */

const categories = computed(() => $shop.categories)
const offers = computed(() => $shop.offers)

const offersLv1 = computed(() => offers.value.slice(0, 5))
const offersLv2 = computed(() => offers.value.slice(5, 15))
const offersLv3 = computed(() => offers.value.slice(15, 20))
const offerRemain = computed(() => offers.value.slice(20, offers.value.length))
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
 * -----------------------------------------
 *	Lifecycle
 * -----------------------------------------
 */

onMounted(() => {
  // set default title
  useTitle('Compras y Envíos | Wings')
})
</script>

<template>
  <main class="p-2 pt-[4.8rem] pb-16 w-full container select-none">
    <div class="space-y-2 mb-2">
      <!-- Lv1 -->
      <div class="px-2" v-if="offersLv1.length">
        <div class="text-gray-800 text-center shadow-sm bg-white p-2">TOP 5</div>

        <div class="flex-col space-y-2 mt-2">
          <OfferAdvancedWidget
            v-for="(offer, index) in offersLv1"
            :key="`home-view-offer-grid-example-${index}`"
            :offer="offer"
            @click="() => goToOffer(offer)"
          />
        </div>
      </div>
      <!-- / Lv1 -->

      <div class="px-2" v-if="categories.length">
        <div class="text-gray-800 text-center shadow-sm bg-white p-2">
          Descubre nuestras Categorías
        </div>
        <CategorySlider :categories="categories" />
      </div>

      <!-- Lv2 -->
      <div class="px-2" v-if="offersLv2.length">
        <div class="text-gray-800 text-center shadow-sm bg-white p-2">En Tendencia</div>
        <OfferSlider
          :offers="offersLv2"
          @click-on-offer="(offer) => goToOffer(offer)"
          class="mt-2"
        />
      </div>
      <!-- / Lv2 -->

      <div class="px-2" v-if="categories.length">
        <div class="text-gray-800 text-center shadow-sm bg-white p-2">
          Descubre nuestras Categorías
        </div>
        <CategorySlider :categories="categories" />
      </div>

      <div class="px-2" v-if="offersLv3.length">
        <div class="text-gray-800 text-center shadow-sm bg-white p-2">Promociones de Hoy</div>

        <div class="grid grid-cols-2 gap-2 mt-2">
          <OfferWidget
            v-for="(offer, index) in offersLv3"
            :key="`home-view-offer-grid-example-${index}`"
            :offer="offer"
            @click="() => goToOffer(offer)"
          />
        </div>
      </div>

      <div class="px-2" v-if="categories.length">
        <CategorySlider :categories="categories" />
      </div>

      <div class="px-2" v-if="offerRemain.length">
        <div class="text-gray-800 text-center shadow-sm bg-white p-2">Ofertas</div>

        <div class="grid grid-cols-2 gap-2 mt-2">
          <OfferWidget
            v-for="(offer, index) in offerRemain"
            :key="`home-view-offer-grid-example-${index}`"
            :offer="offer"
            @click="() => goToOffer(offer)"
          />
        </div>
      </div>
    </div>
  </main>
</template>
