<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { type Offer } from '@/types'
import { STOCK_TYPE } from '@servimav/wings-services'

/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */
const CaretOfferWidget = defineAsyncComponent(
  () => import('@/components/widgets/CaretOfferWidget.vue')
)

/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */
const OFFERS: Array<Offer> = [
  {
    id: 1,
    name: 'Tenis adidas',
    image: '/offers/adidas/1.jpg',
    available: true,
    discount_price: 0,
    production_price: 110,
    sell_price: 120,
    stock_type: STOCK_TYPE.LIMITED,
    stock_qty: 10,
    rating: 4.4,
    views: 600
  }
]
</script>

<template>
  <main class="container w-full select-none p-2 pb-16 pt-[4.8rem]">
    <div class="flex flex-col items-center space-y-3 py-2">
      <CaretOfferWidget :offer="OFFERS[0]" />
      <CaretOfferWidget :offer="OFFERS[0]" />
      <CaretOfferWidget :offer="OFFERS[0]" />
      <CaretOfferWidget :offer="OFFERS[0]" />
      <CaretOfferWidget :offer="OFFERS[0]" />
    </div>
  </main>
</template>
