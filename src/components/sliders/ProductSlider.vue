<script lang="ts" setup>
import { type Product } from '@/types'
import ProductWidget from '@/components/widgets/ProductWidget.vue'

interface ProductSliderProps {
  products: Product[]
}

const props = defineProps<ProductSliderProps>()
</script>

<template>
  <div class="flex items-center overflow-x-scroll h-72 space-x-2">
    <div
      v-for="(product, index) in products"
      :key="`product-slider-${index}`"
      class="w-72 flex-shrink-0"
    >
      <ProductWidget v-bind="product" size="md" />
    </div>
  </div>
</template>

<style scoped></style>
