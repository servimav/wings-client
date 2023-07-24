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

const ListSkeleton = defineAsyncComponent(() => import('@/components/skeletons/ListSkeleton.vue'))
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
    getOrders({ init: false })
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
async function getOrders({ init }: { init: boolean }) {
  if (loading.value) return

  $app.toggleLoading(true)
  try {
    const { data } = await $service.shop.order.mine({
      currency: 'CUP',
      page: init ? undefined : orderPagination.value ? orderPagination.value + 1 : undefined
    })
    $shop.orderPagination = data.meta.current_page
    // if server return data
    if (data.data.length) {
      // If init data
      if (init) $shop.orders = data.data
      // Push data
      else $shop.orders.push(...data.data)
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
  await getOrders({ init: true })
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
    // start get offer
    await getOrders({ init: true })
  }
  // start listening event
  window.addEventListener('scroll', scrollHandler)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', scrollHandler)
})
</script>

<template>
  <PullToRefresh :on-pull="handleOnPull" />
  <main
    class="container h-full min-h-screen w-full select-none p-2 pb-[4.5rem] pt-[3.2rem] text-gray-800"
  >
    <template v-if="orders.length">
      <div v-for="(order, key) in orders" :key="`order-${order.id}-${key}`" class="my-2">
        <RouterLink :to="{ name: ROUTES.ORDER, params: { orderId: order.id } }">
          <OrderWidget :order="order" />
        </RouterLink>
      </div>
    </template>

    <!-- Loading -->
    <div v-else-if="loading" class="my-2">
      <ListSkeleton :repeat="8" />
    </div>
    <!-- / Loading -->

    <!-- No content -->
    <div v-else>No content</div>
    <!-- / No content -->
  </main>
</template>
