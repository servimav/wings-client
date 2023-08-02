<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import { readableStatus, STATUS, type ShopOrder } from '@servimav/wings-services'
import { TITLE, formatDate, toCurrency } from '@/helpers'
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
const ListSkeleton = defineAsyncComponent(() => import('@/components/skeletons/ListSkeleton.vue'))
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

const loading = computed(() => $app.loading)

const order = ref<ShopOrder>()

const totalPrice = computed(
  () =>
    Number(order.value?.delivery_price) +
    Number(order.value?.offers_price) +
    Number(order.value?.service_price)
)

const showDeliveryDate = computed(() => {
  if (!order.value?.delivery_date) return false
  return (
    order.value.delivery_status === STATUS.ONPROGRESS ||
    order.value.delivery_status === STATUS.ONWAY ||
    order.value.delivery_status === STATUS.PARTIAL_PAYED ||
    order.value.delivery_status === STATUS.PAYED
  )
})

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
    $app.axiosError(error, 'No se pudo obtener los datos')
  }
  $app.toggleLoading(false)
}

/**
 -------------------------------------------
 *	Lifecycle
 -------------------------------------------
 */

onBeforeMount(async () => {
  await getOrder()

  useHead({
    title: order.value ? `Pedido # ${order.value.id} | Wings` : TITLE.ORDERS
  })
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
            <li class="capitalize">
              Creado:
              {{ formatDate(order.created_at) }}
            </li>
            <li v-if="showDeliveryDate">
              Entrega:
              {{ formatDate(order.delivery_date as string) }}
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
            small
            to-cup
          />
        </div>
        <!-- / Cart Items -->
      </div>
    </div>

    <!-- Loading -->
    <div v-else-if="loading" class="px-4">
      <ListSkeleton :repeat="8" />
    </div>
    <!-- / Loading -->

    <!-- No content -->
    <div v-else></div>
    <!-- / No content -->
  </main>
</template>
