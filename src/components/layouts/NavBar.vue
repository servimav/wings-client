<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { goBack } from '@/helpers'
import { ROUTES } from '@/router'

/**
 -------------------------------------------
 *	Components
 -------------------------------------------
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
      return 'Perfil'
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

const $route = useRoute()
</script>

<template>
  <nav class="fixed left-0 top-0 z-20 w-full border-b border-b-gray-100 bg-white">
    <div class="flex flex-wrap items-center px-5 py-2">
      <div class="flex grow items-center">
        <button
          type="button"
          @click="goBack"
          class="rounded-xl p-2 transition-colors hover:bg-gray-100"
        >
          <ArrowLeft class="h-5 w-5 text-gray-800" />
        </button>
      </div>
      <h4 class="grow text-xl text-gray-800">{{ title }}</h4>
    </div>
  </nav>
</template>
