<script lang="ts" setup>
import { type Product } from '@/types'
import Icon from '@/components/Icon.vue'
import { shoppingCartOutline } from '@/helpers/icon'

const props = defineProps<Product>()
</script>
<template>
  <div class="relative p-2 pt-5 w-full bg-gray-50 rounded-2xl">
    <div class="px-5 mb-2">
      <img class="h-auto max-w-full" :src="image.src" :alt="image.alt" />
    </div>
    <div class="px-1">
      <div class="mb-0.5 text-sm font-semibold tracking-wide text-gray-800">
        {{ title }}
      </div>
      <div class="text-xs tracking-tight text-gray-600">$ {{ price }}</div>
    </div>

    <Icon v-bind="shoppingCartOutline" class="absolute w-3.5 h-3.5 top-2 right-2 text-gray-800" />
  </div>
</template>
