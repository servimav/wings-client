<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue'
import { type Offer } from '@/types'
import { toCurrency, setDefaultImage } from '@/helpers'
/**
 * -----------------------------------------
 *	Types
 * -----------------------------------------
 */

export interface Props {
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
    <div class="mb-2 min-h-[12rem] flex items-center">
      <img
        class="max-w-full rounded-lg"
        :src="offer.image"
        :alt="offer.name"
        :title="offer.name"
        @error="setDefaultImage"
      />
    </div>
    <div class="mt-2 px-1">
      <div class="text-sm font-semibold tracking-wide text-gray-800">
        {{ offer.name }}
      </div>
      <div class="text-sm tracking-tight text-gray-600">{{ toCurrency(displayPrice) }}</div>
    </div>

    <div class="absolute top-3 right-3 bg-white p-1 rounded-full cursor-pointer">
      <ShoppingCartOutline class="w-3.5 h-3.5 text-gray-800" />
    </div>
  </div>
</template>
