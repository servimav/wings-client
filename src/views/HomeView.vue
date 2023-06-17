<script setup lang="ts">
import { ref } from 'vue'
import ProductSlider from '@/components/sliders/ProductSlider.vue'
import CategorySlider from '@/components/sliders/CategorySlider.vue'
import ProductAdvancedWidget from '@/components/widgets/ProductAdvancedWidget.vue'
import ProductWidget from '@/components/widgets/ProductWidget.vue'
import { CATEGORIES, PRODUCTS } from '@/helpers/defaults'

const category = ref(CATEGORIES[2])
</script>

<template>
  <main class="px-2 pt-20 pb-16 w-full container">
    <div class="px-2 mb-4">
      <ProductSlider :products="PRODUCTS" />
    </div>
    <div class="px-2 mb-2">
      <CategorySlider :categories="CATEGORIES" v-model:category-active="category" class="mb-2" />
      <div class="grid grid-cols-2 gap-4">
        <ProductWidget v-bind="PRODUCTS[0]" size="xs" />
        <ProductWidget v-bind="PRODUCTS[1]" size="xs" />
      </div>
    </div>
    <div class="p-2 mb-2">
      <div class="flex-col space-y-2">
        <ProductAdvancedWidget v-bind="PRODUCTS[0]" />
        <ProductAdvancedWidget v-bind="PRODUCTS[1]" />
        <ProductAdvancedWidget v-bind="PRODUCTS[0]" />
        <ProductAdvancedWidget v-bind="PRODUCTS[1]" />
      </div>
    </div>
  </main>
</template>
