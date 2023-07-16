<script lang="ts" setup>
import { computed } from 'vue'
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
  $props.offer.discount_price && $props.offer.discount_price > 0
    ? $props.offer.discount_price
    : $props.offer.sell_price
)
</script>

<template>
  <div
    class="no-select relative h-full w-full cursor-pointer rounded-lg border border-gray-100 bg-white p-1 transition-shadow hover:shadow"
  >
    <div class="mb-2 flex items-center">
      <img
        class="h-48 w-full rounded-lg object-cover object-center"
        :src="offer.image ?? '/images/default.png'"
        :alt="offer.name"
        :title="offer.name"
        @error="setDefaultImage"
      />
    </div>
    <div class="mt-2 px-1">
      <div class="truncate text-sm font-medium text-gray-800">
        {{ offer.name }}
      </div>
      <div class="text-sm tracking-tight text-gray-600">{{ toCurrency(displayPrice) }}</div>
    </div>
  </div>
</template>
