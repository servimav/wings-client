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
const TopNavbar = defineAsyncComponent(() => import('@/components/layouts/TopNavbar.vue'))
const BottomNavbar = defineAsyncComponent(() => import('@/components/layouts/BottomNavbar.vue'))
const FloatingBackBtn = defineAsyncComponent(() => import('@/components/FloatingBackBtn.vue'))
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

/**
 * getOffers
 */
async function getOffers() {
  const resp = (await $service.shop.offer.filter({ currency: 'CUP' })).data
  $shop.homeOffers = resp.data
  $shop.homeOffersCurrentPage = resp.meta.current_page
}

onBeforeMount(async () => {
  try {
    await Promise.all([getOffers(), getCategories()])
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
</template>
