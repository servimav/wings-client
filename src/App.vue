<script lang="ts" setup>
import { useRoute } from 'vue-router'
import TopNavbar from '@/components/layouts/TopNavbar.vue'
import BottomNavbar from '@/components/layouts/BottomNavbar.vue'
import FloatingBackBtn from '@/components/FloatingBackBtn.vue'
import { ROUTES } from '@/router/names'
const route = useRoute()
</script>

<template>
  <FloatingBackBtn v-if="route.name != ROUTES.HOME" />
  <TopNavbar v-else />
  <RouterView />
  <BottomNavbar v-if="route.name == ROUTES.HOME" />
</template>
