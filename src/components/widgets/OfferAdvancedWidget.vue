<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue'
import { setDefaultImage, toCurrency } from '@/helpers'
import type { Offer } from '@/types'

export type Props = {
  offer: Offer
}
/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */
const ShoppingCartOutline = defineAsyncComponent(
  () => import('@/components/icons/ShoppingCartOutline.vue')
)
/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */

const $props = defineProps<Props>()
/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */
const displayPrice = computed(() =>
  $props.offer.discount_price ? $props.offer.discount_price : $props.offer.sell_price
)
</script>

<template>
  <div
    class="relative w-full cursor-pointer rounded-lg border border-gray-100 bg-white p-1 transition-shadow hover:shadow"
  >
    <div class="mb-2">
      <img
        class="h-64 w-full rounded-lg object-cover object-center"
        :src="offer.image"
        :alt="offer.name"
        :title="offer.name"
        @error="setDefaultImage"
      />
    </div>
    <div
      class="relative -top-6 max-w-fit rounded-full border border-gray-300 bg-white px-3 py-1 text-center font-medium tracking-wide text-gray-800"
    >
      {{ offer.name }}
    </div>

    <div class="absolute left-3 top-3 rounded-full bg-white px-2">
      <span class="text-sm font-medium text-gray-800">{{ toCurrency(displayPrice) }}</span>
    </div>

    <div
      class="absolute right-3 top-3 cursor-pointer rounded-full bg-white p-1.5 shadow-lg hover:shadow-xl"
    >
      <ShoppingCartOutline class="h-5 w-5 text-gray-800" />
    </div>
  </div>
</template>
