<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import type { OrderOffer } from '@servimav/wings-services'
import { useShopStore } from '@/stores'
import { useRouter } from 'vue-router'
import { ROUTES } from '@/router'

/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */
const CaretOfferWidget = defineAsyncComponent(
  () => import('@/components/widgets/CaretOfferWidget.vue')
)
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

/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */
/**
 * addOfferQty
 * @param offerCart
 */
function addOfferQty(offerCart: OrderOffer) {
  $shop.addCartOffer(offerCart)
}

/**
 * goToOffer
 * @param offerCart
 */
function goToOffer(offerCart: OrderOffer) {
  $router.push({
    name: ROUTES.SINGLE_OFFER,
    params: {
      offerId: offerCart.offer.id
    }
  })
}
/**
 * removeOfferQty
 * @param offerCart
 */
function removeOfferQty(offerCart: OrderOffer) {
  $shop.removeCartOffer(offerCart)
}
</script>

<template>
  <main class="container w-full select-none p-2 pb-16 pt-[4.8rem]">
    <div class="p-2" v-if="cart.length">
      <button class="w-full rounded-md border-gray-500 bg-primary-500 px-2.5 py-2 text-white">
        Completar Envío
      </button>
      <div class="mt-2 space-y-2">
        <CaretOfferWidget
          v-for="(offerCart, key) in cart"
          :key="`offer-cart-${key}-${offerCart.offer.id}`"
          :offer-cart="offerCart"
          @decrease="() => removeOfferQty(offerCart)"
          @increase="() => addOfferQty(offerCart)"
          @click-image="() => goToOffer(offerCart)"
        />
      </div>
    </div>
  </main>
</template>
