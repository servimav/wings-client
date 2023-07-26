<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import type { OrderItem } from '@servimav/wings-services'
import { toCurrency } from '@/helpers'
import { ROUTES } from '@/router'
import { useShopStore } from '@/stores'

/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */

const CaretOfferWidget = defineAsyncComponent(
  () => import('@/components/widgets/CaretOfferWidget.vue')
)
const CaretEmpty = defineAsyncComponent(() => import('@/components/icons/CaretEmpty.vue'))

/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */

const $router = useRouter()
const $shop = useShopStore()

/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */

const cart = computed(() => $shop.cart)
const subTotal = computed(() => {
  let val = 0
  cart.value.forEach((item) => {
    const offerPrice = item.offer?.discount_price
      ? item.offer.discount_price
      : item.offer?.sell_price
    val += item.qty * (offerPrice ?? 0)
  })
  return val
})

/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */

/**
 * addOfferQty
 * @param item
 */
function addOfferQty(item: OrderItem) {
  $shop.addCartOffer(item)
}

/**
 * goToOffer
 * @param item
 */
function goToOffer(item: OrderItem) {
  console.log({ item })
  $router.push({
    name: ROUTES.SINGLE_OFFER,
    params: {
      offerId: item.id
    }
  })
}

/**
 * removeOfferQty
 * @param item
 */
function removeOfferQty(item: OrderItem) {
  $shop.removeCartOffer(item)
}

/**
 * goToHome
 */
function goToHome() {
  $router.push({ name: ROUTES.HOME })
}

/**
 -------------------------------------------
 *	Lifecycle
 -------------------------------------------
 */

onBeforeMount(() => {
  useHead({
    title: 'Compras y Envíos | Wings'
  })
})
</script>

<template>
  <main
    class="container h-full min-h-screen w-full p-2 pb-16 pt-12"
    :class="{ 'flex flex-col justify-center': !cart.length }"
  >
    <!-- Main Content -->
    <div class="p-2 pb-32" v-if="cart.length">
      <div class="mt-2 space-y-2">
        <CaretOfferWidget
          v-for="(item, key) in cart"
          :key="`offer-cart-${key}-${item.id}`"
          :item="item"
          @decrease="() => removeOfferQty(item)"
          @increase="() => addOfferQty(item)"
          @click-image="() => goToOffer(item)"
        />
      </div>

      <div class="fixed bottom-0 left-0 z-10 w-full border-t border-gray-100 bg-white px-4 pb-20">
        <div class="mb-2 flex justify-between px-2 py-3 text-lg font-medium text-gray-800">
          <span>Total</span>
          <span>{{ toCurrency(subTotal) }}</span>
        </div>
        <button
          type="button"
          @click="() => $router.push({ name: ROUTES.CHECKOUT })"
          class="btn btn-lg btn-primary w-full"
        >
          Crear Pedido
        </button>
      </div>
    </div>
    <!-- / Main Content -->

    <!-- Empty Caret -->
    <div v-else class="text-center">
      <div class="mb-8">
        <CaretEmpty class="mx-auto h-36 w-36 fill-gray-500" />
      </div>
      <div class="mb-5">
        <h3 class="mb-3 text-2xl font-medium text-gray-800">Carrito vacío</h3>
        <p class="max-w-xs text-gray-500">
          Tu carrito de compras está vacío. ¡Revisa algunas de nuestras ofertas para comenzar a
          comprar!
        </p>
      </div>
      <button type="button" @click="goToHome" class="btn btn-md btn-primary">
        Explorar ofertas
      </button>
    </div>
    <!-- / Empty Caret -->
  </main>
</template>
