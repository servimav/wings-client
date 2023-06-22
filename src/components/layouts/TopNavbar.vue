<script lang="ts" setup>
import { defineAsyncComponent, ref } from 'vue'
/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */
const BellOutline = defineAsyncComponent(() => import('@/components/icons/BellOutline.vue'))
const MangifyGlass = defineAsyncComponent(() => import('@/components/icons/MangifyGlass.vue'))
const ShoppingCartOutline = defineAsyncComponent(
  () => import('@/components/icons/ShoppingCartOutline.vue')
)

const search = ref('')
</script>

<template>
  <nav class="fixed z-10 w-full bg-white border-b border-gray-100 py-2">
    <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl py-2 px-3">
      <form>
        <label
          for="top-navbar-search-input"
          class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >Buscar</label
        >
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
            <MangifyGlass class="w-5 h-5 text-gray-500" />
          </div>
          <input
            v-model="search"
            type="text"
            id="top-navbar-search-input"
            class="block w-full max-w-xs p-2 pl-8 text-sm text-gray-600 border border-gray-400 rounded-lg outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-gray-400"
            placeholder="Buscar..."
            required
          />
        </div>
      </form>

      <div class="flex items-center space-x-3">
        <ShoppingCartOutline
          class="w-5 h-5 cursor-pointer text-gray-600 transition-colors hover:text-gray-800"
        />
        <BellOutline
          class="w-5 h-5 cursor-pointer text-gray-600 transition-colors hover:text-gray-800"
        />
      </div>
    </div>
  </nav>
</template>
