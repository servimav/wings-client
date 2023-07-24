<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { CUP_PRICE, setDefaultImage, toCurrency } from '@/helpers'
import type { OrderItem } from '@servimav/wings-services'
import { useShopStore } from '@/stores'

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
  item: OrderItem
  readonly?: boolean
  toCup?: boolean
  small?: boolean
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
const $shop = useShopStore()

/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */

const cupPrice = computed(() => {
  const cupCurrency = $shop.currencies.find((c) => c.code === 'CUP')
  return cupCurrency ? cupCurrency.price : CUP_PRICE
})

const displayPrice = computed(() => {
  let price = 0
  if ($props.item.price) price = $props.item.price
  else if (offer.value)
    price = offer.value.discount_price ? offer.value.discount_price : offer.value.sell_price
  if ($props.toCup) price = price * cupPrice.value
  return price
})

const offer = computed(() => $props.item.offer)
</script>

<template>
  <div class="flex w-full items-center rounded-xl border border-gray-100 bg-white" v-if="offer">
    <!-- Image -->
    <img
      class="shrink-0 rounded-l-xl object-cover object-center"
      :class="[small ? 'h-28 w-24' : 'h-32 w-28']"
      :src="offer.image ?? '/images/default.png'"
      :alt="offer.name"
      @error="setDefaultImage"
      @click="() => $emit('clickImage')"
    />
    <!-- / Image -->

    <!-- Offer Description -->
    <div class="py-2 pl-4 pr-2">
      <div class="line-clamp-2 text-gray-800">
        {{ offer.name }}
      </div>
      <div class="text-gray-500" :class="[small ? 'mb-2' : 'mb-4']">
        {{ toCurrency((displayPrice as number) * item.qty) }}
      </div>

      <div v-if="readonly" class="w-5 text-center font-medium text-gray-800">x{{ item.qty }}</div>

      <div class="flex items-center space-x-2" v-else>
        <button
          type="button"
          class="rounded-lg p-1 hover:bg-gray-100"
          @click="() => $emit('decrease')"
        >
          <MinusIcon class="h-3 w-3 text-gray-800" />
        </button>
        <div class="w-5 text-center text-gray-800">{{ item.qty }}</div>
        <button
          type="button"
          class="rounded-lg p-1 hover:bg-gray-100"
          @click="() => $emit('increase')"
        >
          <PlusIcon class="h-3 w-3 text-gray-800" />
        </button>
      </div>
    </div>
    <!-- / Offer Description -->
  </div>
</template>
