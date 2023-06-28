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
const CategorySlider = defineAsyncComponent(() => import('@/components/sliders/CategorySlider.vue'))
const NoOrdersModal = defineAsyncComponent(() => import('@/components/modals/NoOrdersModal.vue'))
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
const categories = computed(() =>
  offer.value && offer.value.categories ? offer.value && offer.value.categories : []
)
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
const showNoOrderModal = ref(false)
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
async function onClickShare() {
  if (offer.value) {
    // Get image file from url
    let files: File[] = []
    try {
      const response = await fetch(offer.value.image as string)
      const blob = await response.blob()
      const imageName = `${offer.value.name}.png`
      const imageFile = new File([blob], imageName, { type: blob.type })
      files.push(imageFile)
    } catch (error) {
      console.log({ error })
    }

    // set offer price
    const price = offer.value.discount_price ? offer.value.discount_price : offer.value.sell_price
    // Share message
    let text = `${offer.value.name}\n\nPrecio: ${toCurrency(price)}\n\n`

    if (offer.value.stock_type === 'LIMITED')
      text += `Apúrate, solamente quedan ${offer.value.stock_qty}!!!`
    else if (offer.value.stock_type === 'OUT')
      text += 'En este momento no tenemos disponibilidad pero tal vez pronto tengamos'

    share({
      title: offer.value.name,
      url: location.href,
      text
      // files
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
  <main class="container relative w-full select-none">
    <!-- Share button -->
    <button
      type="button"
      @click="onClickShare"
      v-if="isSupported"
      class="fixed right-5 top-5 z-20 rounded-full bg-white p-1.5 text-gray-900 shadow-lg focus:outline-none"
    >
      <ShareOutline class="h-5 w-5 text-gray-900" />

      <span class="sr-only">Share icon</span>
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
        <div class="flex items-center justify-between gap-2">
          <!-- Title -->
          <h4 class="mb-1 text-xl font-semibold tracking-tight text-gray-800">
            {{ offer.name }}
          </h4>
          <!-- / title -->
          <!-- Prices -->
          <div v-if="offer.discount_price" class="text-right">
            <h4 class="text-xl font-semibold text-gray-800">
              {{ toCurrency(offer.discount_price) }}
            </h4>
            <h5 class="text-sm text-gray-500 line-through">
              {{ toCurrency(offer.sell_price) }}
            </h5>
          </div>

          <h4 v-else class="text-xl text-gray-800">
            {{ toCurrency(offer.sell_price) }}
          </h4>
          <!-- / Prices -->
        </div>

        <!-- Stock -->
        <div class="mb-2 flex justify-between gap-2">
          <span
            v-if="!offer.available"
            class="rounded bg-red-100 px-2.5 py-0.5 font-medium text-red-600"
          >
            No hay Disponibles</span
          >

          <span
            v-else-if="offer.stock_type === 'LIMITED'"
            class="rounded bg-butterfly-blue-50 px-2.5 py-0.5 font-medium text-butterfly-blue-600"
          >
            {{ offer.stock_qty }} Disponibles</span
          >

          <span
            v-else-if="offer.stock_type === 'INFINITY'"
            class="rounded bg-butterfly-blue-50 px-2.5 py-0.5 font-medium text-butterfly-blue-600"
          >
            Excelente Disponibilidad</span
          >

          <span v-else class="rounded bg-red-100 px-2.5 py-0.5 font-medium text-red-600">
            No hay Disponibles</span
          >

          <div
            v-if="offer.available && offer.stock_type !== 'OUT' && offer.min_delivery_days"
            class="rounded-full bg-green-200 px-2 text-gray-900"
          >
            Entrega en {{ offer.min_delivery_days }} días
          </div>
        </div>
        <!-- / Stock -->

        <!-- Store Details -->
        <span class="text-thin mt-4 rounded-full bg-gray-200 px-2 text-sm" v-if="offer.store">
          {{ offer.store.name }}: PID-{{ offer.id }}
        </span>
        <!-- Store Details -->

        <!-- Description -->
        <div class="mb-2.5">
          <h6 class="mb-1 font-medium tracking-wide text-gray-800">Descripción</h6>
          <p class="text-gray-500">
            {{ offer.description }}
          </p>
        </div>
        <!-- / Description -->

        <!-- Attributes -->
        <ul class="list-none space-y-2.5 p-2" v-if="offer.attributes?.length">
          <li class="mb-1 font-medium tracking-wide text-gray-800">Detalles</li>
          <li
            v-for="(attribute, index) in offer.attributes"
            :key="`single-offer-attribute-${index}`"
            class="flex gap-2"
          >
            <h6 class="mb-1 font-medium tracking-wide text-gray-600">{{ attribute.key }}:</h6>
            <div class="text-gray-900">
              {{ attribute.value }}
            </div>
          </li>
        </ul>
        <!-- /Attributes -->

        <!-- categories -->
        <template v-if="categories.length">
          <CategorySlider :categories="categories" go-to-filter />
        </template>
        <!-- / categories -->

        <!-- Similar offers -->
        <template v-if="offersSimilar.length">
          <div
            class="mt-4"
            v-for="(similar, similarKey) in offersSimilar"
            :key="`similar-${similarKey}`"
          >
            <h5 class="text-center text-xl text-gray-800">
              {{ similarKey === 0 ? 'Ofertas Similares' : 'Recomendaciones' }}
            </h5>
            <OfferSlider :offers="similar" class="mt-2" @click-on-offer="goToOffer" />
          </div>
        </template>
        <!-- / Similar offers -->
      </div>
      <!-- / Content -->

      <!-- Button -->
      <div
        class="fixed bottom-0 w-full bg-white px-2 py-4 text-center"
        @click="() => (showNoOrderModal = true)"
      >
        <div
          role="button"
          class="inline-flex w-full max-w-xs items-center justify-center rounded-lg bg-primary-500 px-5 py-2.5 font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100"
        >
          Contactar Vendedor
        </div>
      </div>
      <!-- / Button -->
    </template>
  </main>

  <!-- Zoom Image -->
  <div
    class="fixed left-0 top-0 z-20 flex h-full w-screen items-center overflow-y-scroll bg-black"
    v-if="offer"
    v-show="showFullImage"
  >
    <span class="absolute right-6 top-6 text-2xl text-white" @click="() => (showFullImage = false)"
      >&times;</span
    >
    <img class="m-auto block w-[80%]" :src="offer.image" />
  </div>
  <!-- / Zoom Image -->

  <!-- No Order Modal -->
  <NoOrdersModal v-if="showNoOrderModal" @close="() => (showNoOrderModal = false)" />
  <!-- / NoOrdersModal -->
</template>
