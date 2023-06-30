<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import { RouterView } from 'vue-router'
/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */

const NotificationContainer = defineAsyncComponent(
  () => import('@/components/layouts/NotificationContainer.vue')
)
</script>

<template>
  <RouterView />
  <NotificationContainer class="fixed right-0 top-0 z-50" />
</template>
