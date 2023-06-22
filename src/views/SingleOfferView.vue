<script lang="ts" setup>
import { ref } from 'vue'
import type { Offer } from '@/types'

const offer = ref<Offer>()
</script>

<template>
  <main class="w-full container">
    <template v-if="offer">
      <img :src="offer.image" :alt="offer.name" :title="offer.name" class="w-full h-auto" />

      <div class="relative -top-10 p-4 pb-8 bg-white border border-gray-100 rounded-t-3xl">
        <div class="flex items-start justify-between">
          <h5 class="text-xl mb-1 font-semibold tracking-tight text-gray-800">
            {{ offer.name }}
          </h5>
          <h5 class="text-xl font-semibold text-gray-800">$ {{ offer.sell_price }}</h5>
        </div>
        <div class="mb-2">
          <span
            class="bg-butterfly-blue-50 text-butterfly-blue-600 text-sm font-medium px-2.5 py-0.5 rounded"
          >
            {{ offer.stock_qty }} Disponibles</span
          >
        </div>
        <div class="mb-2.5">
          <h6 class="text-sm text-gray-800 font-medium tracking-wide mb-1">Descripción</h6>
          <p class="text-sm text-gray-500">
            {{ offer.description }}
          </p>
        </div>

        <ul class="space-y-2.5 list-none">
          <li
            v-for="(attribute, index) in offer.attributes"
            :key="`single-offer-attribute-${index}`"
          >
            <h6 class="text-sm text-gray-800 font-medium tracking-wide mb-1">
              {{ attribute.key }}
            </h6>
            <div class="text-sm text-gray-500">
              {{ attribute.value }}
            </div>
          </li>
        </ul>
      </div>

      <div class="fixed py-4 px-2 bottom-0 w-full bg-white text-center">
        <button
          type="button"
          class="w-full max-w-xs font-medium px-5 py-2.5 rounded-lg inline-flex justify-center items-center text-white bg-butterfly-blue transition-colors hover:bg-butterfly-blue-400 focus:ring-4 focus:outline-none focus:ring-butterfly-blue-100"
        >
          Contactar en WhatsApp
        </button>
      </div>
    </template>
  </main>
</template>
