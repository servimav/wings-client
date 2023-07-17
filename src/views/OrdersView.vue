<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import { useHead } from '@vueuse/head'
import { scrollTop } from '@/helpers'
import { useAppStore, useShopStore } from '@/stores'
import { useServices } from '@/services'
import { ROUTES } from '@/router'

/**
 * ------------------------------------------
 *	Components
 * ------------------------------------------
 */

const OrderWidget = defineAsyncComponent(() => import('@/components/widgets/OrderWidget.vue'))
const PullToRefresh = defineAsyncComponent(() => import('@/components/PullToRefresh.vue'))
/**
 * ------------------------------------------
 *	Composables
 * ------------------------------------------
 */

const $app = useAppStore()
const $service = useServices()
const $shop = useShopStore()

/**
 * ------------------------------------------
 *	Data
 * ------------------------------------------
 */
const loading = computed(() => $app.loading)
const orders = computed(() => $shop.orders)
const orderPagination = computed(() => $shop.orderPagination)

const scrollHandler = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  const scrolled = window.scrollY
  if (scrollable - scrolled <= 10) {
    getOrders()
  }
}
/**
 * ------------------------------------------
 *	methods
 * ------------------------------------------
 */
/**
 * getOrders
 */
async function getOrders() {
  if (loading.value) return

  $app.toggleLoading(true)
  try {
    const { data } = await $service.shop.order.mine({
      currency: 'CUP',
      page: orderPagination.value ? orderPagination.value + 1 : undefined
    })
    $shop.orderPagination = data.meta.current_page
    // if server return data
    if (data.data.length) {
      $shop.orders.push(...data.data)
    } else {
      // if no more data stop event
      window.removeEventListener('scroll', scrollHandler)
    }
  } catch (error) {
    $app.axiosError(error)
    window.removeEventListener('scroll', scrollHandler)
  }
  $app.toggleLoading(false)
}

/**
 * handleOnPull
 * @param done
 */
async function handleOnPull(done: CallableFunction) {
  $shop.orders = []
  $shop.orderPagination = undefined
  await getOrders()
  done()
}
/**
 * ------------------------------------------
 *	Lifecycle
 * ------------------------------------------
 */

onBeforeMount(async () => {
  // set default title
  useHead({
    title: 'Pedidos | Wings'
  })
  // scroll top smoothly
  scrollTop()
  // init Data
  if (!$shop.homeOffers.length) {
    $shop.homeOffers = []
    $shop.homePagination = undefined
  }
  // start get offer
  await getOrders()
  // start listening event
  window.addEventListener('scroll', scrollHandler)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', scrollHandler)
})
</script>

<template>
  <PullToRefresh :on-pull="handleOnPull" />

  <main class="container w-full select-none p-2 pb-[4.5rem] pt-[3.2rem] text-gray-800">
    <div v-for="(order, key) in orders" :key="`order-${order.id}-${key}`" class="my-2">
      <RouterLink :to="{ name: ROUTES.ORDER, params: { orderId: order.id } }">
        <OrderWidget :order="order" />
      </RouterLink>
    </div>
  </main>
</template>
