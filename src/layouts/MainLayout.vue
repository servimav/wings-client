<script lang="ts" setup>
import { onBeforeMount } from 'vue'
import { useServices } from '@/services'
import { useAppStore, useShopStore, useUserStore } from '@/stores'
import DrawerLeft from '@/components/layouts/DrawerLeft.vue'

/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */
const $app = useAppStore()
const $service = useServices()
const $shop = useShopStore()
const $user = useUserStore()
/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */

/**
 * getCategories
 */
async function getCategories() {
  const resp = (await $service.shop.category.list()).data
  $shop.categories = resp
}

onBeforeMount(async () => {
  $user.loadFromStorage()
  $shop.getCartFromStorage()
  $app.toggleLoading(true)
  try {
    await Promise.all([getCategories(), $user.geMe(), $shop.getCurrencies()])
    // Get orders
    if ($user.auth_token) {
      $shop.orderPagination = undefined
      $shop.orders = []
      const { data } = await $service.shop.order.mine({ currency: 'CUP', page: undefined })
      $shop.orders = data.data
      $shop.orderPagination = data.meta.current_page
    }
  } catch (error) {
    $app.axiosError(error)
  }
  $app.toggleLoading(false)
})
</script>

<template>
  <div class="bg-gray-50">
    <DrawerLeft />
    <RouterView name="top" />
    <RouterView v-slot="{ Component }">
      <KeepAlive :include="['HomeView', 'IncommingView', 'HelpView']">
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
    <RouterView name="bottom" />
  </div>
</template>
