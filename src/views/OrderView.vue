<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import { readableStatus, type ShopOrder } from '@servimav/wings-services'
import { toCurrency } from '@/helpers'
import { useServices } from '@/services'
import { useAppStore } from '@/stores'
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
  } catch (error) {
    $app.axiosError(error)
  }
  $app.toggleLoading(false)
}

/**
 * formatDate
 * @param date text in date format
 */
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 -------------------------------------------
 *	Lifecycle
 -------------------------------------------
 */

onBeforeMount(() => {
  useHead({
    title: 'Pedidos | Wings'
  })

  getOrder()
})
</script>

<template>
  <main class="text-slate-900 container w-full select-none pb-16 pt-16">
    <div class="px-4" v-if="order">
      <div class="text-right text-sm font-thin">Orden #{{ order.id }}</div>

      <div class="mt-2 space-y-2">
        <!-- Status -->
        <div class="rounded-md border bg-white p-4">
          <ul class="list-none space-y-2">
            <li class="text-center">
              <span class="rounded-xl border bg-gray-200 p-1">
                {{ readableStatus(order.delivery_status) }}
              </span>
            </li>
            <li v-if="order.delivery_date">
              Entrega:
              {{ formatDate(order.delivery_date) }}
            </li>
            <li>Dirección: {{ order.delivery_details.address }}</li>
            <li>Destinatario: {{ order.delivery_details.name }}</li>
            <li>Teléfono: {{ order.delivery_details.contact }}</li>
          </ul>
        </div>
        <!-- / Status -->

        <!-- Prices -->
        <div class="rounded-md border bg-white p-4">
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
