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
    class="relative p-1 w-full bg-white border border-gray-100 rounded-lg transition-shadow hover:shadow"
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
      class="relative -top-6 px-3 py-1 max-w-fit bg-white border border-gray-300 rounded-full text-center font-medium text-gray-800 tracking-wide"
    >
      {{ offer.name }}
    </div>

    <div class="absolute top-3 left-3 px-2 bg-white rounded-full">
      <span class="text-sm font-medium text-gray-800">{{ toCurrency(displayPrice) }}</span>
    </div>

    <div
      class="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-lg cursor-pointer hover:shadow-xl"
    >
      <ShoppingCartOutline class="w-5 h-5 text-gray-800" />
    </div>
  </div>
</template>
