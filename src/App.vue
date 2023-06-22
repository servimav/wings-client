<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { ROUTES } from '@/router/names'
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
</script>

<template>
  <FloatingBackBtn v-if="$route.name != ROUTES.HOME" />
  <TopNavbar v-else />
  <RouterView />
  <BottomNavbar v-if="$route.name == ROUTES.HOME" />
</template>
