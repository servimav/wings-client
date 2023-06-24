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
  <div class="flex items-center overflow-x-scroll no-scrollbar space-x-3 py-2 px-3">
    <div
      v-for="(category, index) in categories"
      :key="`category-slider-${index}`"
      class="px-3 py-2 text-sm text-center rounded-full cursor-pointer transition-colors"
      :class="[
        categoryActive && category.name == categoryActive.name
          ? 'bg-butterfly-blue-500 text-white hover:bg-butterfly-blue-400'
          : 'text-gray-800 bg-white border border-gray-300 hover:bg-gray-100'
      ]"
      @click="() => onCategoryClick(category)"
    >
      {{ category.name }}
    </div>
  </div>
</template>
