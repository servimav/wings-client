<script lang="ts" setup>
import { computed, defineAsyncComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { ShopOfferFilter } from '@servimav/wings-services'
import { ROUTES } from '@/router'
import { useShopStore } from '@/stores'
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
const ShoppingCartOutline = defineAsyncComponent(
  () => import('@/components/icons/ShoppingCartOutline.vue')
)
const MangifyGlass = defineAsyncComponent(() => import('@/components/icons/MangifyGlass.vue'))

/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */
const $router = useRouter()
const $shop = useShopStore()
/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */

const search = ref<ShopOfferFilter>({
  currency: 'CUP',
  search: '',
  sort: 'views'
})

const showPulse = computed(() => $shop.orders.length > 0)
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
  <nav class="fixed z-20 w-full border-b border-gray-100 bg-white">
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
            <MangifyGlass class="h-6 w-6 cursor-pointer text-gray-500" />
          </button>
          <input
            :value="search.search"
            @change.prevent="onInputChange"
            type="text"
            id="top-navbar-search-input"
            class="input block h-10 w-full p-2 pl-8 text-sm"
            placeholder="Buscar..."
          />
        </div>
      </form>

      <RouterLink :to="{ name: ROUTES.ORDERS }" class="flex cursor-pointer items-center space-x-3">
        <div class="p-2">
          <ShoppingCartOutline
            class="z-0 h-6 w-6 text-gray-600 transition-colors hover:text-gray-800"
          />
          <span
            v-if="showPulse"
            class="absolute right-2 top-4 inline-flex h-5 w-5 items-center justify-center"
          >
            <span
              class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"
            ></span>
            <span class="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
          </span>
        </div>
      </RouterLink>
    </div>
  </nav>
</template>
