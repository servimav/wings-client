<script setup lang="ts">
import { defineAsyncComponent, onBeforeMount, ref } from 'vue'
import type { ShopCategory } from '@servimav/wings-services'
import type { Offer } from '@/types'
import { useServices } from '@/services'
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
const $service = useServices()

/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */

const categories = ref<ShopCategory[]>([])
const offers = ref<Offer[]>([])
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

onBeforeMount(async () => {
  try {
    Promise.all([getOffers(), getCategories()])
  } catch (error) {
    console.log({ error })
  }
})
</script>

<template>
  <main class="px-2 pt-20 pb-16 w-full container">
    <div class="px-2 mb-4">
      <OfferSlider :offers="offers" />
    </div>
    <div class="px-2 mb-2">
      <CategorySlider :categories="categories" class="mb-2" />
      <div class="grid grid-cols-2 gap-2">
        <OfferWidget
          v-for="(offer, index) in offers"
          :key="`home-view-offer-grid-example-${index}`"
          :offer="offer"
        />
      </div>
    </div>
    <div class="p-2 mb-2">
      <div class="flex-col space-y-2">
        <OfferAdvancedWidget
          v-for="(offer, index) in offers"
          :key="`home-view-offer-grid-example-${index}`"
          :offer="offer"
        />
      </div>
    </div>
  </main>
</template>
