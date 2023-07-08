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
    case ROUTES.CARET:
      return 'Carrito'
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
function goBack() {
  const previousRoute = $router.currentRoute.value
  $router.back()

  if (previousRoute !== $router.currentRoute.value) $router.push({ name: ROUTES.HOME })
}
</script>

<template>
  <nav class="fixed left-0 top-0 z-10 w-full border-b border-b-gray-100 bg-white">
    <div class="flex flex-wrap items-center px-5 py-3">
      <div class="flex grow items-center">
        <button type="button" class="focus:outline-none" @click="goBack">
          <ArrowLeft class="h-5 w-5 text-gray-800" />
        </button>
      </div>
      <h4 class="grow text-xl text-gray-800">{{ title }}</h4>
    </div>
  </nav>
</template>
