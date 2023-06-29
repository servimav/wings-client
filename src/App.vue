<script lang="ts" setup>
import { defineAsyncComponent, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { ROUTES } from '@/router/names'
import { useShopStore } from './stores'
import { useServices } from './services'
/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */
const BottomNavbar = defineAsyncComponent(() => import('@/components/layouts/BottomNavbar.vue'))
const FloatingBackBtn = defineAsyncComponent(() => import('@/components/FloatingBackBtn.vue'))
const NotificationContainer = defineAsyncComponent(
  () => import('@/components/layouts/NotificationContainer.vue')
)
const TopNavbar = defineAsyncComponent(() => import('@/components/layouts/TopNavbar.vue'))
/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */

const $route = useRoute()
const $service = useServices()
const $shop = useShopStore()
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
  $shop.getCartFromStorage()

  try {
    await getCategories()
  } catch (error) {
    console.log({ error })
  }
})
</script>

<template>
  <template v-if="$route.name !== ROUTES.SINGLE_OFFER">
    <TopNavbar />
    <BottomNavbar />
  </template>
  <FloatingBackBtn v-else />

  <RouterView />

  <NotificationContainer class="fixed right-0 top-0 z-50" />
</template>
