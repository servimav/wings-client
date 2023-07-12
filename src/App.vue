<script lang="ts" setup>
import { defineAsyncComponent, onBeforeMount } from 'vue'
import { RouterView } from 'vue-router'
import { useCapacitor } from '@/helpers/capacitor'
import { useUserStore } from '@/stores'

const $capacitor = useCapacitor()
const $user = useUserStore()
/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */

const NotificationContainer = defineAsyncComponent(
  () => import('@/components/layouts/NotificationContainer.vue')
)

onBeforeMount(() => {
  $user.loadFromStorage()

  // Register App event listener
  $capacitor.backListener()
  $capacitor.openUrlListener()
})
</script>

<template>
  <RouterView />
  <NotificationContainer class="fixed right-0 top-0 z-50" />
</template>
