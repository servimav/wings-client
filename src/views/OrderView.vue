<script setup lang="ts">
import { useServices } from '@/services'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { ShopOrder } from '@servimav/wings-services'
import { useAppStore } from '@/stores'
import { useTitle } from '@vueuse/core'

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
    const data = (await $service.shop.order.show(orderId)).data
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
  <main class="container w-full select-none p-2 pb-16 pt-14">
    {{ order }}
  </main>
</template>