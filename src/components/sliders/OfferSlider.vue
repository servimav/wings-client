<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import type { Offer } from '@/types'
/**
 * -----------------------------------------
 *	Types
 * -----------------------------------------
 */

interface ProductSliderProps {
  offers: Offer[]
}
/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */
const OfferWidget = defineAsyncComponent(() => import('@/components/widgets/OfferWidget.vue'))
/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */

defineProps<ProductSliderProps>()
</script>

<template>
  <div class="flex items-center overflow-x-scroll no-scrollbar space-x-2 py-2">
    <div v-for="(offer, index) in offers" :key="`offer-slider-${index}`" class="w-44 flex-shrink-0">
      <OfferWidget :offer="offer" />
    </div>
  </div>
</template>
