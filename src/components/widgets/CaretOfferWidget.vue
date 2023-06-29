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
  <div class="flex max-w-fit items-center justify-between rounded-lg bg-white p-2">
    <img
      class="h-[5.5rem] w-[5.5rem] shrink-0 rounded-lg"
      :src="offer.image ?? '/images/default.png'"
      :alt="offer.name"
      @error="setDefaultImage"
    />

    <div class="ml-2">
      <div class="mb-1 font-medium text-gray-800">{{ offer.name }}</div>
      <div class="text-sm text-gray-500">{{ toCurrency(displayPrice) }}</div>
    </div>

    <div class="ml-8 mr-3 flex items-center justify-center space-x-3">
      <Minus class="h-3 w-3 cursor-pointer text-gray-800" />
      <div class="w-5 text-sm text-gray-800">12</div>
      <Plus class="h-3 w-3 cursor-pointer text-gray-800" />
    </div>
  </div>
</template>
