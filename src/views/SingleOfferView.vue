<script lang="ts" setup>
import { computed, defineAsyncComponent, onBeforeMount, ref } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { useHead } from '@vueuse/head'
import { STOCK_TYPE } from '@servimav/wings-services'
import { toCurrency, setDefaultImage, scrollTop } from '@/helpers'
import { ROUTES } from '@/router'
import { useServices } from '@/services'
import { useAppStore, useShopStore } from '@/stores'
import type { Offer } from '@/types'
import { useCapacitor } from '@/helpers/capacitor'
/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */
const GoBackBtn = defineAsyncComponent(() => import('@/components/GoBackBtn.vue'))
const CategorySlider = defineAsyncComponent(() => import('@/components/sliders/CategorySlider.vue'))
const OfferSlider = defineAsyncComponent(() => import('@/components/sliders/OfferSlider.vue'))
const ShareOutline = defineAsyncComponent(() => import('@/components/icons/ShareOutline.vue'))
const SingleOfferSkeleton = defineAsyncComponent(
  () => import('@/components/skeletons/SingleOfferSkeleton.vue')
)
const ShoppingBagOutline = defineAsyncComponent(
  () => import('@/components/icons/ShoppingBagOutline.vue')
)

/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */
const $app = useAppStore()
const $route = useRoute()
const $router = useRouter()
const $service = useServices()
const $shop = useShopStore()
const { canShare, share } = useCapacitor()
/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */
const canAdd = computed(() => {
  // Check offer
  if (offer.value) {
    // Stock
    if (offer.value.stock_type === STOCK_TYPE.OUT) return false
    if (offer.value.stock_type === STOCK_TYPE.LIMITED && !offer.value.stock_qty) return false
    // Check cart
    const cartIndex = $shop.cart.findIndex((item) => item.id === offer.value?.id)
    if (cartIndex >= 0) {
      const qty = $shop.cart[cartIndex].qty
      if (offer.value.stock_type === STOCK_TYPE.LIMITED && (offer.value.stock_qty as number) < qty)
        return false
    }
    return true
  }
  return false
})

const cartCounter = computed(() => {
  let counter = 0
  $shop.cart.forEach((offerCart) => {
    counter += offerCart.qty
  })
  return counter
})

const categories = computed(() =>
  offer.value && offer.value.categories ? offer.value && offer.value.categories : []
)

const fullImage = ref<string>()

const loading = computed(() => $app.loading)

const offer = ref<Offer>()

const offersSimilar = ref<Array<Offer[]>>([])

const realStockQty = computed(() => {
  if (offer.value) {
    if (offer.value.stock_type === STOCK_TYPE.LIMITED) {
      // Check cart
      const cartIndex = $shop.cart.findIndex((item) => item.id === offer.value?.id)
      if (cartIndex >= 0) {
        const qty = $shop.cart[cartIndex].qty
        return Number(offer.value.stock_qty) - qty
      }
    }
    return offer.value.stock_qty
  }
  return 0
})
const shareIsSupported = ref(false)

/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */

/**
 * addOfferToCart
 */
function addOfferToCart() {
  if (offer.value)
    $shop.addCartOffer({
      store_id: 0,
      offer: offer.value,
      qty: 1,
      id: offer.value.id,
      image: offer.value.image as string,
      name: offer.value.name,
      price:
        offer.value.discount_price && offer.value.discount_price > 0
          ? offer.value.discount_price
          : offer.value.sell_price
    })
  $app.success(`Agregado ${offer.value?.name}`)
}

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
 * goToCart
 */
function goToCart() {
  void $router.push({
    name: ROUTES.CARET
  })
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
    $app.toggleLoading(true)
    // get the offer
    await getOffer(offerId)
    // get similar offers and put title
    if (offer.value) {
      useHead({
        title: `${offer.value?.name} | Wings`,
        meta: [
          { name: 'og:title', content: `${offer.value?.name} | Wings` },
          { name: 'og:type', content: 'website' },
          { name: 'og:url', content: `https://wings.servimav.com/offer/${offer.value.id}` },
          { name: 'og:image', content: offer.value.image }
        ]
      })
      await getOfferSimilar(offerId)
    } else {
      $router.push({ name: ROUTES.HOME })
    }
  } catch (error) {
    $app.axiosError(error, 'No encontramos la oferta')
    $router.push({ name: ROUTES.HOME })
  }
  $app.toggleLoading(false)
}

/**
 * handle on share button click event
 */
async function onClickShare() {
  if (offer.value) {
    // set offer price
    const price = offer.value.discount_price ? offer.value.discount_price : offer.value.sell_price
    // Share message
    let text = `${offer.value.name}\n\nPrecio: ${toCurrency(price)}\n\n`

    if (offer.value.stock_type === STOCK_TYPE.LIMITED)
      text += `Apúrate, solamente quedan ${offer.value.stock_qty}!!!`
    else if (offer.value.stock_type === STOCK_TYPE.OUT)
      text += 'En este momento no tenemos disponibilidad pero tal vez pronto tengamos'
    else if (offer.value.stock_type === STOCK_TYPE.INCOMMING) text += 'Pedidos por encargos'

    const url = `https://wings.servimav.com/offer/${offer.value.id}`

    share({
      dialogTitle: `Comparte ${offer.value.name}`,
      title: offer.value.name,
      url,
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
    scrollTop()
    // Cast offerId as Number
    const offerId = Number($route.params.offerId)
    shareIsSupported.value = (await canShare()).value

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
  <!-- Navigation buttons  -->
  <nav class="fixed left-0 top-5 z-10 w-screen">
    <div class="flex items-center justify-between px-5">
      <GoBackBtn />

      <!-- Share button -->
      <button
        v-if="shareIsSupported"
        type="button"
        @click="onClickShare"
        class="rounded-full bg-white p-2 shadow-lg focus:outline-none"
      >
        <ShareOutline class="h-5 w-5 text-gray-900" />
        <span class="sr-only">Share icon</span>
      </button>
      <!-- Share button -->
    </div>
  </nav>
  <!-- / Navigation buttons  -->

  <main class="container relative w-full select-none">
    <template v-if="offer">
      <div class="fixed h-96 w-full bg-white">
        <img
          :src="offer.image ?? '/images/default.png'"
          :alt="offer.name"
          :title="offer.name"
          class="w-full"
          @error="setDefaultImage"
          @click="() => (fullImage = offer?.image)"
        />
      </div>

      <!-- Content -->
      <div class="min-h-[15rem] translate-y-96 space-y-4 rounded-t-3xl bg-white px-4 pb-28 pt-4">
        <div class="grid grid-cols-3">
          <div class="p-1" v-for="(img, key) in offer.gallery" :key="`gallery-${key}`">
            <img
              :src="img"
              class="w-full"
              :title="offer.name"
              :alt="offer.name"
              @click="() => (fullImage = img)"
            />
          </div>
        </div>
        <div class="flex items-center justify-between gap-2">
          <div>
            <!-- Title -->

            <h4 class="mb-1 text-xl font-semibold tracking-tight text-gray-800">
              {{ offer.name }}
            </h4>
            <!-- / Title -->
            <!-- Stock -->
            <div class="text-sm">
              <span v-if="!offer.available" class="rounded bg-red-100 px-2.5 py-0.5 text-red-600">
                Inventario Vacío</span
              >

              <span
                v-else-if="offer.stock_type === STOCK_TYPE.LIMITED"
                class="rounded bg-blue-50 px-2.5 py-0.5 text-blue-600"
              >
                {{ realStockQty }} Disponibles</span
              >

              <span
                v-else-if="offer.stock_type === STOCK_TYPE.OUT"
                class="rounded bg-red-100 px-2.5 py-0.5 text-red-600"
              >
                No hay Disponibles</span
              >

              <span
                v-else-if="offer.stock_type === STOCK_TYPE.INCOMMING"
                class="rounded bg-green-100 px-2.5 py-0.5 text-green-900"
              >
                Por Encargo</span
              >
            </div>
            <!-- / Stock -->
          </div>

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

        <!-- Store Details -->
        <!-- <span class="text-thin mt-4 rounded-full bg-gray-200 px-2 text-sm" v-if="offer.store">
					{{ offer.store.name }}: PID-{{ offer.id }}
				</span> -->
        <!-- / Store Details -->

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
        <!-- / Attributes -->

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
        class="fixed bottom-0 flex w-full space-x-2 border-0 bg-white p-4 text-center"
        :class="{ 'justify-end': !canAdd }"
      >
        <button @click="addOfferToCart" v-if="canAdd" class="btn btn-lg btn-primary flex-1">
          Añadir al Carrito
        </button>
        <button v-if="cartCounter" @click="goToCart" class="btn btn-lg btn-secondary relative">
          <ShoppingBagOutline class="h-6 w-6" />
          <div
            class="absolute -top-2 right-2 inline-flex items-center justify-center rounded-full bg-primary px-1 py-0 text-sm font-medium text-white"
          >
            {{ cartCounter }}
          </div>
        </button>
      </div>
      <!-- / Button -->
    </template>

    <SingleOfferSkeleton v-else-if="loading" />
  </main>

  <!-- Zoom Image -->
  <div
    class="fixed left-0 top-0 z-20 flex h-full w-screen items-center overflow-y-scroll bg-black"
    v-if="offer"
    v-show="fullImage"
    @click="() => (fullImage = undefined)"
  >
    <span class="absolute right-6 top-6 text-2xl text-white">&times;</span>
    <img class="m-auto block w-[80%]" :src="fullImage ?? '/images/default.png'" />
  </div>
  <!-- / Zoom Image -->
</template>
