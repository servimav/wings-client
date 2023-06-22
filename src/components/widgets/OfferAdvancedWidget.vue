<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import { type Offer } from '@/types'

export type OfferAdvancedWidgetProps = Offer
/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */
const ShoppingCartOutline = defineAsyncComponent(
  () => import('@/components/icons/ShoppingCartOutline.vue')
)

defineProps<OfferAdvancedWidgetProps>()
</script>

<template>
  <div
    class="relative p-1 w-full bg-white border border-gray-100 rounded-lg transition-shadow hover:shadow"
  >
    <div class="mb-2">
      <img
        class="h-64 w-full rounded-lg object-cover object-center"
        :src="`offers/${image.src}`"
        :alt="image.alt"
      />
    </div>
    <div
      class="relative -top-6 px-3 py-1 max-w-fit bg-white border border-gray-300 rounded-full text-center font-medium text-gray-800 tracking-wide"
    >
      {{ name }}
    </div>

    <div class="absolute top-3 left-3 px-2 bg-white rounded-full">
      <span class="text-sm font-medium text-gray-800">${{ sell_price }}</span>
    </div>

    <div
      class="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-lg cursor-pointer hover:shadow-xl"
    >
      <ShoppingCartOutline class="w-5 h-5 text-gray-800" />
    </div>
  </div>
</template>
