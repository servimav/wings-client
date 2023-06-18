<script lang="ts" setup>
import { type Offer } from '@/types'
import Icon from '@/components/Icon.vue'
import { shoppingCartSolid } from '@/helpers/icon'

const props = defineProps<Offer>()
</script>

<template>
  <div class="relative py-3 w-full bg-gray-50 rounded-xl">
    <div class="absolute top-3.5 left-3.5">
      <h3 class="text-xl font-bold text-gray-800 w-36">{{ name }}</h3>
      <div class="-mt-1 text-gray-600 font-light tracking-tight">$ {{ sell_price }}</div>
    </div>
    <div class="relative py-2 px-4 pl-14 mb-2">
      <img class="h-auto w-44 mx-auto" :src="`offers/${image.src}`" :alt="image.alt" />
    </div>

    <div class="text-center">
      <button
        type="button"
        class="px-3 py-1.5 text-sm font-medium text-center rounded-full inline-flex items-center text-white bg-butterfly-blue transition-colors hover:bg-butterfly-blue-400 focus:ring-4 focus:outline-none focus:ring-butterfly-blue-100"
      >
        Añadir
        <Icon v-bind="shoppingCartSolid" class="ml-2 w-4 h-4" />
      </button>
    </div>
  </div>
</template>
