<script setup lang="ts">
import ProductAdvanced from '@/components/widgets/ProductAdvanced.vue'
import ProductWidget from '@/components/widgets/ProductWidget.vue'
import ProductSlider from '@/components/sliders/ProductSlider.vue'
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

const PRODUCTS: Array<Product> = [
  {
    title: 'Sueter',
    image: { src: 'products/sueter-small.png', alt: 'Sueter' },
    price: 105
  },
  { title: 'Adidas', image: { src: 'products/adidas-small.png', alt: 'Adidas' }, price: 105 },
  {
    title: 'Sueter',
    image: { src: 'products/sueter-small.png', alt: 'Sueter' },
    price: 105
  },
  { title: 'Adidas', image: { src: 'products/adidas-small.png', alt: 'Adidas' }, price: 105 }
]
</script>

<template>
  <main class="px-2 pt-20 pb-16 w-full container">
    <div class="px-2 mb-4">
      <ProductSlider :products="PRODUCTS" />
    </div>
    <div class="px-2 mb-2">
      <div class="grid grid-cols-2 gap-4">
        <ProductWidget v-bind="PRODUCT" size="xs" />
        <ProductWidget v-bind="OTHER_PRODUCT" size="xs" />
      </div>
    </div>
    <div class="p-2 mb-2">
      <div class="flex-col space-y-2">
        <ProductAdvanced v-bind="PRODUCT" />
        <ProductAdvanced v-bind="OTHER_PRODUCT" />
        <ProductAdvanced v-bind="PRODUCT" />
        <ProductAdvanced v-bind="OTHER_PRODUCT" />
      </div>
    </div>
  </main>
</template>
