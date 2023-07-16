<script lang="ts" setup>
import { onBeforeMount } from 'vue'
import { useServices } from '@/services'
import { useShopStore, useUserStore } from '@/stores'
import DrawerLeft from '@/components/layouts/DrawerLeft.vue'

/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */

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

  try {
    Promise.all([getCategories(), $user.geMe(), $shop.getCurrencies()])
  } catch (error) {
    console.log({ error })
  }
})
</script>

<template>
  <div class="bg-gray-50">
    <DrawerLeft />
    <RouterView name="top" />
    <RouterView v-slot="{ Component }">
      <KeepAlive :include="['HomeView', 'IncommingView']">
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
    <RouterView name="bottom" />
  </div>
</template>
