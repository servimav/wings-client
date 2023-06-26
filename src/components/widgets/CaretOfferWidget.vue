<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { setDefaultImage, toCurrency } from '@/helpers'
import { type Offer } from '@/types'

/**
 * -----------------------------------------
 *	Types
 * -----------------------------------------
 */
interface Props {
  offer: Offer
}

/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */

const Plus = defineAsyncComponent(() => import('@/components/icons/Plus.vue'))
const Minus = defineAsyncComponent(() => import('@/components/icons/Minus.vue'))

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
  <div class="flex justify-between items-center bg-white p-2 rounded-lg max-w-fit">
    <img
      class="shrink-0 w-[5.5rem] h-[5.5rem] rounded-lg"
      :src="offer.image"
      :alt="offer.name"
      @error="setDefaultImage"
    />

    <div class="ml-2">
      <div class="text-gray-800 font-medium mb-1">{{ offer.name }}</div>
      <div class="text-gray-500 text-sm">{{ toCurrency(displayPrice) }}</div>
    </div>

    <div class="flex justify-center items-center space-x-3 ml-8 mr-3">
      <Minus class="w-3 h-3 text-gray-800 cursor-pointer" />
      <div class="w-5 text-sm text-gray-800">12</div>
      <Plus class="w-3 h-3 text-gray-800 cursor-pointer" />
    </div>
  </div>
</template>
