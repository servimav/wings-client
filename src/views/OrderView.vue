<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTitle } from '@vueuse/core'
import { STATUS, type ShopOrder } from '@servimav/wings-services'
import { useServices } from '@/services'
import { useAppStore, useShopStore } from '@/stores'
import { setDefaultImage, toCurrency, CUP_PRICE } from '@/helpers'

interface OrderStatus {
  label: string
  class: string
}

/**
 * ------------------------------------------
 *	Composable
 * ------------------------------------------
 */
const $app = useAppStore()
const $route = useRoute()
const $service = useServices()
const $shop = useShopStore()
/**
 * ------------------------------------------
 *	Data
 * ------------------------------------------
 */

const cupPrice = computed(() => {
  const cupCurrency = $shop.currencies.find((c) => c.code === 'CUP')
  return cupCurrency ? cupCurrency.price : CUP_PRICE
})
const order = ref<ShopOrder>()

const orderStatus = computed<OrderStatus | undefined>(() => {
  if (order.value) {
    switch (order.value.delivery_status) {
      case STATUS.ACCEPTED:
        return {
          class: '',
          label: 'Aceptada'
        }
      case STATUS.CANCELED_BY_CLIENT:
        return {
          class: '',
          label: 'Cancelada'
        }
      case STATUS.CANCELED_BY_PROVIDER:
        return {
          class: '',
          label: 'Cancelada'
        }
      case STATUS.COMPLETED:
        return {
          class: '',
          label: 'Completada'
        }
      case STATUS.CREATED:
        return {
          class: '',
          label: 'Creada'
        }
      case STATUS.ONPROGRESS:
        return {
          class: '',
          label: 'En Progreso'
        }
    }
  }
  return undefined
})

const totalPrice = computed(
  () =>
    Number(order.value?.delivery_price) +
    Number(order.value?.offers_price) +
    Number(order.value?.service_price)
)

/**
 * ------------------------------------------
 *	Methods
 * ------------------------------------------
 */
/**
 * getOrder
 */
async function getOrder() {
  const orderId = Number($route.params.orderId)
  $app.toggleLoading(true)
  try {
    const data = (
      await $service.shop.order.show(orderId, {
        currency: 'CUP'
      })
    ).data
    order.value = data
  } catch (error) {
    $app.axiosError(error)
  }
  $app.toggleLoading(false)
}

onBeforeMount(() => {
  useTitle('Compras y Envíos | Wings')

  getOrder()
})
</script>

<template>
  <main class="container w-full select-none pb-16 pt-16 text-slate-900">
    <div class="bg-white px-4" v-if="order">
      <div class="text-right text-sm font-thin">Orden #{{ order.id }}</div>

      <div class="mt-2 space-y-2">
        <!-- Status -->
        <div class="border p-4 text-sm">
          <ul class="list-none space-y-1">
            <li :class="orderStatus?.class">Estado: {{ orderStatus?.label }}</li>
            <li v-if="order.delivery_date">
              Entrega:
              {{
                new Date(order.delivery_date).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              }}
            </li>
            <li>Dirección: {{ order.delivery_details.address }}</li>
            <li>Destinatario: {{ order.delivery_details.name }}</li>
            <li>Teléfono: {{ order.delivery_details.contact }}</li>
          </ul>
        </div>
        <!-- / Status -->

        <!-- Prices -->
        <div class="border p-4 text-sm">
          <ul class="list-none space-y-1">
            <li>Precio de Productos: {{ toCurrency(order.offers_price) }}</li>
            <li>
              Precio de Envío:
              {{
                order.delivery_price && order.delivery_price > 0
                  ? toCurrency(order.delivery_price)
                  : 'Gratis'
              }}
            </li>
            <li>Total: {{ toCurrency(totalPrice) }}</li>
          </ul>
        </div>
        <!-- / Prices -->

        <!-- Destination -->
        <div class="border p-4 text-sm">
          <ul class="list-none space-y-1">
            <li>Precio de Productos: {{ toCurrency(order.offers_price) }}</li>
            <li>
              Precio de Envío:
              {{
                order.delivery_price && order.delivery_price > 0
                  ? toCurrency(order.delivery_price)
                  : 'Gratis'
              }}
            </li>
            <li>Total: {{ toCurrency(totalPrice) }}</li>
          </ul>
        </div>
        <!-- / Destination -->

        <!-- Cart Items -->
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="(item, itemKey) in order.items"
            :key="`item-cart-${itemKey}-${item.id}`"
            class="border border-slate-100 bg-white p-2"
          >
            <div class="p-1">
              <img
                :src="item.offer?.image"
                :title="item.offer?.name"
                :alt="item.offer?.name"
                @error="setDefaultImage"
              />
            </div>
            <div class="p-2 text-sm">{{ toCurrency(item.price * cupPrice) }} (x{{ item.qty }})</div>
          </div>
        </div>
        <!-- / Cart Items -->
      </div>
    </div>
  </main>
</template>
