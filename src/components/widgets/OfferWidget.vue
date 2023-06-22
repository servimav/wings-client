<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import { type Offer } from '@/types'

export type OfferWidgetProps = Offer

const ShoppingCartOutline = defineAsyncComponent(
  () => import('@/components/icons/ShoppingCartOutline.vue')
)

defineProps<OfferWidgetProps>()
</script>

<template>
  <div
    class="relative p-1 w-full bg-white border border-gray-100 rounded-lg transition-shadow hover:shadow"
  >
    <div class="mb-2">
      <img class="h-full max-w-full rounded-lg" :src="`offers/${image.src}`" :alt="image.alt" />
    </div>
    <div class="px-1">
      <div class="text-sm font-semibold tracking-wide text-gray-800">
        {{ name }}
      </div>
      <div class="text-sm tracking-tight text-gray-600">${{ sell_price }}</div>
    </div>

    <div class="absolute top-3 right-3 bg-white p-1 rounded-full cursor-pointer">
      <ShoppingCartOutline class="w-3.5 h-3.5 text-gray-800" />
    </div>
  </div>
</template>
