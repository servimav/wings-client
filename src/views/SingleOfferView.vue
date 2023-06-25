<script lang="ts" setup>
import { computed, defineAsyncComponent, onBeforeMount, ref } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { useShare, useTitle } from '@vueuse/core'
import { toCurrency, setDefaultImage, scrollTop } from '@/helpers'
import { useServices } from '@/services'
import type { Offer } from '@/types'
import { ROUTES } from '@/router'
/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */
const OfferSlider = defineAsyncComponent(() => import('@/components/sliders/OfferSlider.vue'))
const ShareOutline = defineAsyncComponent(() => import('@/components/icons/ShareOutline.vue'))

/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */
const $route = useRoute()
const $router = useRouter()
const $service = useServices()
const { isSupported, share } = useShare()
/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */
const contactUrl = computed(() => {
  const url = location.href
  if (offer.value) {
    const store = offer.value.store
    const phone = store && store.contact_phone ? store.contact_phone : '5355190107'
    const price = offer.value.discount_price ? offer.value.discount_price : offer.value.sell_price
    const message = `Hola, le escribo porque me interesa el producto:\n${
      offer.value.name
    } \nPrecio: ${toCurrency(price)}\nEnlace: ${url}`
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  }
  return '#'
})
const offer = ref<Offer>()
const offersSimilar = ref<Array<Offer[]>>([])
const showFullImage = ref(false)
/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */

/**
 * getOffer from route params
 */
async function getOffer(offerId: number) {
  // get offer
  const resp = await $service.shop.offer.showClient(offerId, { currency: 'CUP' })
  offer.value = resp.data
}
/**
 * getOfferSimilar
 * @param offerId
 */
async function getOfferSimilar(offerId: number) {
  offersSimilar.value = []
  const firstLevel = (
    await $service.shop.offer.showSimilar(offerId, {
      currency: 'CUP',
      level: 0
    })
  ).data
  offersSimilar.value.push(firstLevel)

  const secondLevel = (
    await $service.shop.offer.showSimilar(offerId, {
      currency: 'CUP',
      level: 1
    })
  ).data

  offersSimilar.value.push(secondLevel)
}

/**
 * goToOffer
 * @param offer
 */
function goToOffer(offer: Offer) {
  $router.push({
    name: ROUTES.SINGLE_OFFER,
    params: {
      offerId: offer.id
    }
  })
}
/**
 * loadData
 */
async function loadData(offerId: number) {
  try {
    // get the offer
    await getOffer(offerId)
    // get similar offers and put title
    if (offer.value) {
      useTitle(`${offer.value?.name} | Wings`)
      await getOfferSimilar(offerId)
    }
  } catch (error) {
    console.log({ error })
  }
}
/**
 * handle on share button click event
 */
function onClickShare() {
  if (offer.value && isSupported.value) {
    const price = offer.value.discount_price ? offer.value.discount_price : offer.value.sell_price

    let text = `${offer.value.name} por solo ${toCurrency(price)}!!!\n`

    if (offer.value.stock_type === 'LIMITED')
      text += `Apúrate, solamente quedan ${offer.value.stock_qty}!!!`
    else if (offer.value.stock_type === 'OUT')
      text += 'En este momento no tenemos disponibilidad pero tal vez pronto tengamos'

    share({
      title: offer.value.name,
      url: location.href,
      text
    })
  }
}

/**
 * -----------------------------------------
 *	Lifecycle
 * -----------------------------------------
 */

onBeforeMount(async () => {
  // check if param "offerId" exists on url
  if ($route.params.offerId) {
    // Cast offerId as Number
    const offerId = Number($route.params.offerId)
    await loadData(offerId)
  }
})

/**
 * react to route url change
 */
onBeforeRouteUpdate(async (to) => {
  // check if param "offerId" exists on url
  if (to.params.offerId) {
    scrollTop()
    // Cast offerId as Number
    const offerId = Number(to.params.offerId)
    await loadData(offerId)
  }
})
</script>

<template>
  <main class="w-full container relative select-none">
    <!-- Share button -->
    <button
      type="button"
      @click="onClickShare"
      class="fixed z-20 top-5 right-5 rounded-full p-1.5 text-gray-900 bg-white shadow-lg focus:outline-none"
    >
      <ShareOutline class="h-5 w-5 text-gray-900" />

      <span class="sr-only">Arrow left icon</span>
    </button>
    <!-- Share button -->

    <template v-if="offer">
      <div class="fixed h-96 w-full bg-white">
        <img
          :src="offer.image"
          :alt="offer.name"
          :title="offer.name"
          class="w-full"
          @error="setDefaultImage"
          @click="() => (showFullImage = true)"
        />
      </div>

      <!-- Content -->
      <div class="min-h-[15rem] translate-y-96 space-y-4 rounded-t-3xl bg-white px-4 pb-28 pt-8">
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
            v-if="!offer.available"
            class="bg-red-100 text-red-600 font-medium px-2.5 py-0.5 rounded"
          >
            No hay Disponibles</span
          >

          <span
            v-else-if="offer.stock_type === 'LIMITED'"
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
            <h6 class="text-gray-600 font-medium tracking-wide mb-1">{{ attribute.key }}:</h6>
            <div class="text-gray-900">
              {{ attribute.value }}
            </div>
          </li>
        </ul>

        <!-- Similar offers -->
        <template v-if="offersSimilar.length">
          <div
            class="mt-4"
            v-for="(similar, similarKey) in offersSimilar"
            :key="`similar-${similarKey}`"
          >
            <h5 class="text-center text-gray-800 text-xl">
              {{ similarKey === 0 ? 'Ofertas Similares' : 'Recomendaciones' }}
            </h5>
            <OfferSlider :offers="similar" class="mt-2" @click-on-offer="goToOffer" />
          </div>
        </template>
        <!-- / Similar offers -->
      </div>
      <!-- / Content -->

      <!-- Button -->
      <div class="fixed py-4 px-2 bottom-0 w-full bg-white text-center">
        <a
          :href="contactUrl"
          role="button"
          class="w-full max-w-xs font-medium px-5 py-2.5 rounded-lg inline-flex justify-center items-center text-white bg-primary-500 transition-colors hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-100"
        >
          Contactar Vendedor
        </a>
      </div>
      <!-- / Button -->
    </template>
  </main>

  <!-- Zoom Image -->
  <div
    class="z-20 absolute overflow-y-scroll top-0 left-0 w-screen h-full bg-black flex items-center"
    v-if="offer"
    v-show="showFullImage"
  >
    <span class="absolute top-6 right-6 text-white text-2xl" @click="() => (showFullImage = false)"
      >&times;</span
    >
    <img class="m-auto block w-[80%]" :src="offer.image" />
  </div>
  <!-- / Zoom Image -->
</template>
