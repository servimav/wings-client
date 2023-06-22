<script lang="ts" setup>
import { type Category } from '@/types'

interface CategorySliderProps {
  categories: Category[]
  categoryActive: Category
}

const props = defineProps<CategorySliderProps>()
const emit = defineEmits<{
  (e: 'update:categoryActive', value: Category): void
}>()
</script>

<template>
  <div class="flex items-center overflow-x-scroll no-scrollbar space-x-3 py-2 px-3">
    <div
      v-for="(category, index) in categories"
      :key="`category-slider-${index}`"
      class="px-3 py-2 text-sm text-center rounded-full cursor-pointer transition-colors"
      :class="[
        category.name == categoryActive.name
          ? 'bg-butterfly-blue-500 text-white hover:bg-butterfly-blue-400'
          : 'text-gray-800 bg-white border border-gray-300 hover:bg-gray-100'
      ]"
      @click="$emit('update:categoryActive', category)"
    >
      {{ category.name }}
    </div>
  </div>
</template>
