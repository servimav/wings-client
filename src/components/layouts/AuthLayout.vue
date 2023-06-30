<script setup lang="ts">
import { ROUTES } from '@/router'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */
const $route = useRoute()

/**
 * --------------------------------------------
 * Data
 * --------------------------------------------
 */
const subtitle = computed(() =>
  $route.name == ROUTES.LOGIN
    ? 'Inicia sesión para disfrutar de todos los beneficios que tenemos para tí'
    : 'Regístrate para acceder a nuestras ofertas.'
)
</script>

<template>
  <div
    class="w-full h-screen container bg-cover bg-center"
    style="background-image: url('images/auth.jpg')"
  >
    <div class="flex flex-col h-full">
      <div class="flex items-center flex-grow px-4 py-3">
        <div class="w-72">
          <h5 class="mb-2 text-3xl font-medium tracking-tight text-gray-800">
            Compras y Envíos Wings.
          </h5>
          <p class="font-light text-gray-800">{{ subtitle }}</p>
        </div>
      </div>
      <RouterView class="flex-none" />
    </div>
  </div>
</template>
