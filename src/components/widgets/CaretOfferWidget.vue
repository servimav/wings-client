<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { setDefaultImage, toCurrency } from '@/helpers'
import type { OrderOffer } from '@servimav/wings-services'

/**
 * -----------------------------------------
 *	Types
 * -----------------------------------------
 */
interface Emit {
  (e: 'decrease'): void
  (e: 'increase'): void
  (e: 'clickImage'): void
}

interface Props {
  offerCart: OrderOffer
}

/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */

const PlusIcon = defineAsyncComponent(() => import('@/components/icons/PlusIcon.vue'))
const MinusIcon = defineAsyncComponent(() => import('@/components/icons/MinusIcon.vue'))

/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */
const $emit = defineEmits<Emit>()
const $props = defineProps<Props>()

/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */

const displayPrice = computed(() =>
  $props.offerCart.offer.discount_price
    ? $props.offerCart.offer.discount_price
    : $props.offerCart.offer.sell_price
)
</script>

<template>
  <div
    class="flex w-full items-center justify-between rounded-lg border border-slate-100 bg-white p-2 shadow-sm"
  >
    <img
      class="w-[5.5rem] shrink-0 rounded-lg"
      :src="offerCart.offer.image ?? '/images/default.png'"
      :alt="offerCart.offer.name"
      @error="setDefaultImage"
      @click="() => $emit('clickImage')"
    />

    <div class="ml-2">
      <div class="mb-1 font-medium text-gray-800">{{ offerCart.offer.name }}</div>
      <div class="text-sm text-gray-500">{{ toCurrency(displayPrice * offerCart.qty) }}</div>
    </div>

    <div class="ml-8 mr-3 flex items-center justify-center gap-2">
      <MinusIcon @click="() => $emit('decrease')" class="h-3 w-3 cursor-pointer text-gray-800" />
      <div class="w-5 text-center text-sm text-gray-800">{{ offerCart.qty }}</div>
      <PlusIcon @click="() => $emit('increase')" class="h-3 w-3 cursor-pointer text-gray-800" />
    </div>
  </div>
</template>
