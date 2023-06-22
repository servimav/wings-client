<script lang="ts" setup>
import { type Offer } from '@/types'
import OfferWidget from '@/components/widgets/OfferWidget.vue'

interface ProductSliderProps {
  offers: Offer[]
}

const props = defineProps<ProductSliderProps>()
</script>

<template>
  <div class="flex items-center overflow-x-scroll no-scrollbar space-x-2 py-2">
    <div v-for="(offer, index) in offers" :key="`offer-slider-${index}`" class="w-44 flex-shrink-0">
      <OfferWidget v-bind="offer" />
    </div>
  </div>
</template>
