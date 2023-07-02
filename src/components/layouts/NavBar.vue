<script setup lang="ts">
import { ROUTES } from '@/router'
import { computed, defineAsyncComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'

/**
 ******************************************
 *	Components
 ******************************************
 */
const ArrowLeft = defineAsyncComponent(() => import('@/components/icons/ArrowLeft.vue'))

/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */
const title = computed(() => {
  switch ($route.name) {
    case ROUTES.CHECKOUT:
      return 'Envío'
    default:
      return null
  }
})

/**
 * -----------------------------------------
 *	Composable
 * -----------------------------------------
 */
const $router = useRouter()
const $route = useRoute()

/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */
function goHome() {
  $router.push({
    name: ROUTES.HOME
  })
}
</script>

<template>
  <nav class="fixed top-0 left-0 z-10 w-full border-b border-b-gray-100 bg-white">
    <div class="flex flex-wrap items-center px-2 py-3">
      <div class="grow flex items-center">
        <button type="button" class="focus:outline-none" @click="goHome">
          <ArrowLeft class="h-5 w-5 text-gray-500" />
        </button>
      </div>
      <h4 class="grow text-xl text-gray-500 font-normal">{{ title }}</h4>
    </div>
  </nav>
</template>
