<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ROUTES } from '@/router'

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
    case ROUTES.CARET:
      return 'Carrito'
    case ROUTES.INCOMMING:
      return 'Encargos'
    case ROUTES.CHECKOUT:
      return 'Envío'
    case ROUTES.ORDER:
      return 'Detalles de Pedido'
    case ROUTES.ORDERS:
      return 'Pedidos'
    case ROUTES.USER:
      return 'Usuario'
    case ROUTES.HELP:
      return 'Ayuda'
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
  <nav class="fixed left-0 top-0 z-20 w-screen border-b border-b-gray-100 bg-white">
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
