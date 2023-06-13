<script setup lang="ts">
import ProductAdvanced from '@/components/widgets/ProductAdvanced.vue'
import ProductBase from '@/components/widgets/ProductBase.vue'
import { type Product } from '@/types'

const PRODUCT: Product = {
  title: 'Adidas',
  image: { src: 'products/adidas-small.png', alt: 'Adidas' },
  price: 105
}
const OTHER_PRODUCT: Product = {
  title: 'Sueter',
  image: { src: 'products/sueter-small.png', alt: 'Sueter' },
  price: 105
}
</script>

<template>
  <main class="px-2 py-3 w-full container">
    <div class="px-2">
      <div class="grid grid-cols-2 gap-4">
        <ProductBase v-bind="PRODUCT" />
        <ProductBase v-bind="OTHER_PRODUCT" />
      </div>
    </div>
    <div class="p-2">
      <div class="flex-col space-y-2">
        <ProductAdvanced v-bind="PRODUCT" />
        <ProductAdvanced v-bind="OTHER_PRODUCT" />
        <ProductAdvanced v-bind="PRODUCT" />
        <ProductAdvanced v-bind="OTHER_PRODUCT" />
      </div>
    </div>
  </main>
</template>
