<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import { STATUS, type ShopOrder } from '@servimav/wings-services'
import { toCurrency } from '@/helpers'
import { useServices } from '@/services'
import { useAppStore } from '@/stores'

interface OrderStatus {
  label: string
  class: string
}
/**
 * ------------------------------------------
 *	Components
 * ------------------------------------------
 */
const CaretOfferWidget = defineAsyncComponent(
  () => import('@/components/widgets/CaretOfferWidget.vue')
)
/**
 * ------------------------------------------
 *	Composable
 * ------------------------------------------
 */
const $app = useAppStore()
const $route = useRoute()
const $service = useServices()
/**
 * ------------------------------------------
 *	Data
 * ------------------------------------------
 */

const order = ref<ShopOrder>()

const orderStatus = computed<OrderStatus | undefined>(() => {
  if (order.value) {
    switch (order.value.delivery_status) {
      case STATUS.ACCEPTED:
        return {
          class: '',
          label: 'Pagada y En Espera de Envío'
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
          label: 'En espera de Pago'
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
      await $service.shop.order.showClient(orderId, {
        currency: 'CUP'
      })
    ).data
    order.value = data

    console.log({
      order: order.value
    })
  } catch (error) {
    $app.axiosError(error)
  }
  $app.toggleLoading(false)
}

onBeforeMount(() => {
  useHead({
    title: 'Pedidos | Wings'
  })

  getOrder()
})
</script>

<template>
  <main class="text-slate-900 container w-full select-none pb-16 pt-16">
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

        <!-- Cart Items -->
        <div class="space-y-2">
          <CaretOfferWidget
            v-for="(item, itemKey) in order.items"
            :key="`item-order-${itemKey}-${item.id}`"
            :item="item"
            readonly
            to-cup
          />
        </div>
        <!-- / Cart Items -->
      </div>
    </div>
  </main>
</template>
