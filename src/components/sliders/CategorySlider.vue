<script lang="ts" setup>
import { ROUTES } from '@/router'
import { type Category } from '@/types'
import type { ShopOfferFilter } from '@servimav/wings-services'
import { useRouter, type LocationQueryRaw } from 'vue-router'

interface CategorySliderProps {
  categories: Category[]
  categoryActive?: Category
  goToFilter?: boolean
}
/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */
const $props = defineProps<CategorySliderProps>()
const $emit = defineEmits<{
  (e: 'update:categoryActive', value: Category): void
}>()
const $router = useRouter()

/**
 * -----------------------------------------
 *	methods
 * -----------------------------------------
 */

function onCategoryClick(category: Category) {
  if ($props.goToFilter) {
    const query: ShopOfferFilter = {
      category_id: category.id,
      currency: 'CUP',
      sort: 'views'
    }
    $router.push({
      name: ROUTES.FILTER,
      query: query as LocationQueryRaw
    })
  } else {
    $emit('update:categoryActive', category)
  }
}
</script>

<template>
  <div class="no-scrollbar flex items-center space-x-3 overflow-x-scroll px-3 py-2">
    <div
      v-for="(category, index) in categories"
      :key="`category-slider-${index}`"
      class="no-select cursor-pointer rounded-full px-3 py-2 text-center text-sm transition-colors"
      :class="[
        categoryActive && category.name == categoryActive.name
          ? 'bg-butterfly-blue-500 hover:bg-butterfly-blue-400 text-white'
          : 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-100'
      ]"
      @click="() => onCategoryClick(category)"
    >
      {{ category.name }}
    </div>
  </div>
</template>
