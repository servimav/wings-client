<script lang="ts" setup>
import { computed } from 'vue'
import { type Product } from '@/types'
import Icon from '@/components/Icon.vue'
import { shoppingCartOutline } from '@/helpers/icon'

type breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface ProductWidget extends Product {
  size: breakpoint
}

const props = defineProps<ProductWidget>()

const titleClass = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'text-sm'
    case 'md':
      return 'text-lg'
    default:
      return 'text-lg'
  }
})

const priceClass = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'text-xs'
    case 'md':
      return 'text-base'
    default:
      return 'text-base'
  }
})

const caretIconClass = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'w-3.5 h-3.5 top-2 right-2'
    case 'md':
      return 'w-5 h-5 top-4 right-4'
    default:
      return 'w-5 h-5 top-4 right-4'
  }
})
</script>

<template>
  <div class="relative p-2 pt-5 w-full bg-gray-50 rounded-2xl">
    <div class="px-5 mb-2">
      <img class="h-full max-w-full" :src="image.src" :alt="image.alt" />
    </div>
    <div class="px-1">
      <div class="font-semibold tracking-wide text-gray-800" :class="[titleClass]">
        {{ title }}
      </div>
      <div class="tracking-tight text-gray-600" :class="[priceClass]">$ {{ price }}</div>
    </div>

    <Icon
      v-bind="shoppingCartOutline"
      class="absolute text-gray-600 cursor-pointer hover:text-gray-800"
      :class="[caretIconClass]"
    />
  </div>
</template>
