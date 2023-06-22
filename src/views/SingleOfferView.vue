<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toCurrency, setDefaultImage } from '@/helpers'
import { useServices } from '@/services'
import type { Offer } from '@/types'

/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */
const $route = useRoute()
const $router = useRouter()
const $service = useServices()
/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */
const loading = ref(false)
const offer = ref<Offer>()
/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */

/**
 * getOffer from route params
 */
async function getOffer() {
  // check if param "offerId" exists on url
  if ($route.params.offerId) {
    // Cast offerId as Number
    const offerId = Number($route.params.offerId)
    loading.value = true
    // make request
    try {
      // get offer
      const resp = await $service.shop.offer.showClient(offerId, { currency: 'CUP' })
      offer.value = resp.data
    } catch (error) {
      console.log({ error })
    }
    loading.value = false
  }
}

/**
 * -----------------------------------------
 *	Lifecycle
 * -----------------------------------------
 */

onBeforeMount(async () => {
  await getOffer()
})
</script>

<template>
  <main class="w-full container relative">
    <template v-if="offer">
      <div class="fixed h-96 w-full bg-slate-500">
        <img
          :src="offer.image"
          :alt="offer.name"
          :title="offer.name"
          class="w-full h-full"
          @error="setDefaultImage"
        />
      </div>

      <!-- Content -->
      <div class="min-h-[15rem] translate-y-96 space-y-4 rounded-t-3xl bg-white px-4 pb-36 pt-8">
        <div class="flex gap-2 items-center justify-between">
          <!-- Title -->
          <h4 class="text-xl mb-1 font-semibold tracking-tight text-gray-800">
            {{ offer.name }}
          </h4>
          <!-- / title -->
          <!-- Prices -->
          <div v-if="offer.discount_price" class="text-right">
            <h4 class="font-semibold text-gray-800 text-xl">
              {{ toCurrency(offer.discount_price) }}
            </h4>
            <h5 class="line-through text-gray-500 text-sm">
              {{ toCurrency(offer.sell_price) }}
            </h5>
          </div>

          <h4 v-else class="text-gray-800 text-xl">
            {{ toCurrency(offer.sell_price) }}
          </h4>
          <!-- / Prices -->
        </div>

        <!-- Stock -->
        <div class="mb-2">
          <span
            v-if="offer.stock_type === 'LIMITED'"
            class="bg-butterfly-blue-50 text-butterfly-blue-600 font-medium px-2.5 py-0.5 rounded"
          >
            {{ offer.stock_qty }} Disponibles</span
          >

          <span
            v-else-if="offer.stock_type === 'INFINITY'"
            class="bg-butterfly-blue-50 text-butterfly-blue-600 font-medium px-2.5 py-0.5 rounded"
          >
            Muchos Disponibles</span
          >

          <span v-else class="bg-red-100 text-red-600 font-medium px-2.5 py-0.5 rounded">
            No hay Disponibles</span
          >
        </div>
        <!-- / Stock -->

        <div class="mb-2.5">
          <h6 class="text-gray-800 font-medium tracking-wide mb-1">Descripción</h6>
          <p class="text-gray-500">
            {{ offer.description }}
          </p>
        </div>

        <ul class="space-y-2.5 list-none p-2" v-if="offer.attributes?.length">
          <li class="text-gray-800 font-medium tracking-wide mb-1">Detalles</li>
          <li
            v-for="(attribute, index) in offer.attributes"
            :key="`single-offer-attribute-${index}`"
            class="flex gap-2"
          >
            <h6 class="text-gray-600 font-medium tracking-wide mb-1">
              {{ attribute.key }}
            </h6>
            <div class="text-gray-800">
              {{ attribute.value }}
            </div>
          </li>
        </ul>
      </div>
      <!-- / Content -->

      <!-- Button -->
      <div class="fixed py-4 px-2 bottom-0 w-full bg-white text-center">
        <button
          type="button"
          class="w-full max-w-xs font-medium px-5 py-2.5 rounded-lg inline-flex justify-center items-center text-white bg-butterfly-blue transition-colors hover:bg-butterfly-blue-400 focus:ring-4 focus:outline-none focus:ring-butterfly-blue-100"
        >
          Contactar en WhatsApp
        </button>
      </div>
      <!-- / Button -->
    </template>
  </main>
</template>
