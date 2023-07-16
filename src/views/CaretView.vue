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
const SadIcon = defineAsyncComponent(() => import('@/components/icons/SadOutline.vue'))
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

onBeforeMount(() => {
  useHead({
    title: 'Compras y Envíos | Wings'
  })
})
</script>

<template>
  <main class="container w-full select-none p-2 pb-16 pt-14">
    <div class="p-2" v-if="cart.length">
      <div
        role="button"
        @click="() => $router.push({ name: ROUTES.CHECKOUT })"
        class="w-full rounded-md border-gray-500 bg-primary px-2.5 py-2 text-center text-white"
      >
        Crear Pedido ({{ toCurrency(subTotal) }})
      </div>

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
    </div>

    <!-- No content -->
    <div v-else class="flex min-h-[30rem] items-center justify-center">
      <div class="px-4">
        <SadIcon class="mx-auto h-28 w-28 text-gray-500" />
        <p class="text-center text-lg text-gray-600">Tienes el carrito vacío</p>

        <div class="mt-2">
          <button
            @click="() => $router.push({ name: ROUTES.HOME })"
            class="w-full rounded-lg border border-primary-dark px-2 py-1.5 text-primary-dark dark:border-white dark:text-white"
          >
            Ver Ofertas
          </button>
        </div>
      </div>
    </div>
    <!-- /  No content  -->
  </main>
</template>
