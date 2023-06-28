<script lang="ts" setup>
import { ROUTES } from '@/router'
import { defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */
const ArrowLeft = defineAsyncComponent(() => import('@/components/icons/ArrowLeft.vue'))
const $router = useRouter()

function goHome() {
  $router.push({
    name: ROUTES.HOME
  })
}
</script>

<template>
  <button
    type="button"
    class="fixed left-5 top-5 z-20 rounded-full bg-white p-1.5 text-gray-900 shadow-lg focus:outline-none"
    @click="goHome"
  >
    <ArrowLeft class="h-5 w-5 text-gray-900" />

    <span class="sr-only">Arrow left icon</span>
  </button>
</template>
