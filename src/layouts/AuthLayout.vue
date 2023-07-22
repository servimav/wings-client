<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ROUTES } from '@/router'

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

const title = computed(() =>
  $route.name == ROUTES.LOGIN ? 'Hola, <br /> Bienvenido a Wings.' : 'Regístrate para acceder.'
)
</script>

<template>
  <main class="container h-full min-h-screen w-full">
    <div class="mb-3 max-w-sm space-y-4 px-4 pt-16">
      <h5 class="text-[2.5rem] font-normal leading-tight text-gray-800" v-html="title"></h5>
      <p class="w-72 text-xl font-light text-gray-500">
        Tienda en línea con ofertas y encargos para tí.
      </p>
    </div>
    <RouterView />
  </main>
</template>
