<script lang="ts" setup>
import { defineAsyncComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { ShopOfferFilter } from '@servimav/wings-services'
import { ROUTES } from '@/router'
/**
 * -----------------------------------------
 *	Types
 * -----------------------------------------
 */

export interface Prop {
  search?: string
}
/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */
const ChatOutline = defineAsyncComponent(() => import('@/components/icons/ChatOutline.vue'))
const MangifyGlass = defineAsyncComponent(() => import('@/components/icons/MangifyGlass.vue'))

/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */
const $router = useRouter()
/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */

const contactUrl = `https://wa.me/17372811360?text=${encodeURIComponent('Hola')}`

const search = ref<ShopOfferFilter>({
  currency: 'CUP',
  search: '',
  sort: 'views'
})
/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */

/**
 * onInputChange
 * @param event
 */
function onInputChange(event: Event) {
  const value = (event.target as HTMLInputElement).value
  search.value.search = value
}

/**
 * onSubmit
 */
function onSubmit() {
  $router.push({
    name: ROUTES.FILTER,
    query: search.value
  })
}
</script>

<template>
  <nav class="fixed z-20 w-full border-b border-gray-100 bg-white py-2">
    <div
      class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between gap-2 px-3 py-2"
    >
      <form class="flex-1" @submit.prevent="onSubmit">
        <label
          for="top-navbar-search-input"
          class="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Buscar</label
        >
        <div class="relative">
          <button type="submit" class="absolute inset-y-0 left-0 flex items-center pl-2">
            <MangifyGlass class="h-5 w-5 cursor-pointer text-gray-500" />
          </button>
          <input
            :value="search.search"
            @change.prevent="onInputChange"
            type="text"
            id="top-navbar-search-input"
            class="input block w-full p-2 pl-8 text-sm"
            placeholder="Buscar..."
          />
        </div>
      </form>

      <a :href="contactUrl" target="_blank" class="flex items-center space-x-3">
        <!-- <ShoppingCartOutline class="h-6 w-6 cursor-pointer text-gray-600 transition-colors hover:text-gray-800" /> -->
        <ChatOutline
          class="h-7 w-7 cursor-pointer text-gray-600 transition-colors hover:text-gray-800"
        />
      </a>
    </div>
  </nav>
</template>
