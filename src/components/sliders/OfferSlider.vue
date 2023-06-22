<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import type { Offer } from '@/types'
/**
 * -----------------------------------------
 *	Types
 * -----------------------------------------
 */

export interface Emit {
  (e: 'clickOnOffer', offer: Offer): void
}

export interface Props {
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

defineProps<Props>()
const $emits = defineEmits<Emit>()
</script>

<template>
  <div class="flex items-center overflow-x-scroll no-scrollbar space-x-2 py-2">
    <div v-for="(offer, index) in offers" :key="`offer-slider-${index}`" class="w-44 flex-shrink-0">
      <OfferWidget :offer="offer" @click="() => $emit('clickOnOffer', offer)" />
    </div>
  </div>
</template>
