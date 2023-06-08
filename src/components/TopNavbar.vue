<script lang="ts" setup>
import { ref } from 'vue'
import Icon from '@/components/Icon.vue'
import { shoppingCartOutline, magnifyingGlassOutline, bellOutline } from '@/helpers/icon'
const search = ref('')
</script>
<template>
  <nav class="bg-white border-b border-gray-100">
    <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl py-2 px-3">
      <form>
        <label
          for="search-input"
          class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >Buscar</label
        >
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
            <Icon v-bind="magnifyingGlassOutline" class="w-4 h-4 text-gray-400" />
          </div>
          <input
            v-model="search"
            type="text"
            id="search-input"
            class="block w-full p-2 pl-8 text-sm text-gray-500 border border-gray-200 rounded-lg outline-none focus:border-gray-200 focus:ring-1 focus:ring-gray-200"
            placeholder="Buscar..."
            required
          />
        </div>
      </form>

      <div class="flex items-center space-x-3">
        <Icon
          v-bind="shoppingCartOutline"
          class="w-5 h-5 text-gray-600 hover:text-gray-700 cursor-pointer"
        />
        <Icon
          v-bind="bellOutline"
          class="w-5 h-5 text-gray-600 hover:text-gray-700 cursor-pointer"
        />
      </div>
    </div>
  </nav>
</template>
