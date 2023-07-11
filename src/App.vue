<script lang="ts" setup>
import { defineAsyncComponent, onBeforeMount } from 'vue'
import { RouterView } from 'vue-router'
import { useUserStore } from './stores'

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
})
</script>

<template>
  <RouterView />
  <NotificationContainer class="fixed right-0 top-0 z-50" />
</template>
