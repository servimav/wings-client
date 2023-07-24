<script setup lang="ts">
import { computed } from 'vue'
import { readableStatus, type ShopOrder } from '@servimav/wings-services'
import { CUP_PRICE, toCurrency } from '@/helpers'
import { useShopStore } from '@/stores'

interface Prop {
  order: ShopOrder
}

const $props = defineProps<Prop>()

const $shop = useShopStore()

const cupPrice = computed(() => {
  const cupCurrency = $shop.currencies.find((c) => c.code === 'CUP')
  return cupCurrency ? cupCurrency.price : CUP_PRICE
})

const statusStyle = computed<string>(() => {
  // const status = $props.order.delivery_status
  // if (status === STATUS.CANCELED_BY_CLIENT
  // 	|| status === STATUS.CANCELED_BY_PROVIDER)
  // 	return 'bg-red-500 text-white'
  // else if (status === STATUS.COMPLETED)
  // 	return 'bg-green-500 text-white'
  // else if (status === STATUS.WAITING_PAYMENT)
  // 	return 'bg-yellow-300 text-black'
  // else if (status === STATUS.ACCEPTED
  // 	|| status === STATUS.ONPROGRESS
  // 	|| status === STATUS.ONWAY)
  // 	return 'bg-green-200'
  // else if (status === STATUS.PAYED
  // 	|| status === STATUS.PAYED_BACK
  // 	|| status === STATUS.PARTIAL_PAYED)
  // 	return 'bg-teal-300 text-black'
  return 'bg-gray-200'
})

const totalPrice = computed(
  () =>
    Number($props.order.offers_price) +
    Number($props.order.delivery_price) +
    Number($props.order.service_price)
)
</script>

<template>
  <div class="rounded-md border border-gray-300 bg-white p-4">
    <div class="flex justify-between">
      <b>Id: {{ order.id }}</b>
      <b>Total: {{ toCurrency(totalPrice) }}</b>
    </div>
    <div class="mt-2 text-sm">
      <ul class="list-none space-y-2">
        <li class="text-center">
          <span :class="['rounded-xl border p-1', statusStyle]">
            {{ readableStatus(order.delivery_status) }}
          </span>
        </li>
        <li>
          Envio:
          {{ order.delivery_price > 0 ? toCurrency(order.delivery_price) : 'Gratis' }}
          {{ order.delivery_details.address }}
        </li>
      </ul>
    </div>

    <div class="mt-2 text-sm">
      <p>
        Pago:
        {{
          order.payment_type === 'TRANSFER_PARTIAL'
            ? toCurrency(totalPrice / 2)
            : toCurrency(totalPrice)
        }}
      </p>
    </div>

    <div class="border-slate-200 bg-slate-100 mt-2 rounded-sm border p-2 text-sm">
      <ul class="list-none">
        <li v-for="(item, itemKey) in order.items" :key="`item-${itemKey}-${item.id}-${order.id}`">
          {{ toCurrency(item.price * cupPrice) }} x{{ item.qty }} - {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
