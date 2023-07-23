<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { useRoute, type RouteLocationNamedRaw } from 'vue-router'
import { ELEMENT_ID } from '@/helpers'
import { ROUTES } from '@/router'
import { useShopStore } from '@/stores'
import { initDrawers } from 'flowbite'

/**
 * -----------------------------------------
 *	Types
 * -----------------------------------------
 */

interface Link {
  to: RouteLocationNamedRaw
}

interface LabelLink extends Link {
  label: string
}

interface IconLabelLink extends LabelLink {
  icon: typeof HomeOutline
  badge?: number
}

/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */

const HomeOutline = defineAsyncComponent(() => import('@/components/icons/HomeOutline.vue'))
const SquaresOutline = defineAsyncComponent(
  () => import('@/components/icons/Squqres2x2Outline.vue')
)
const ShoppingBagOutline = defineAsyncComponent(
  () => import('@/components/icons/ShoppingBagOutline.vue')
)
const UserOutline = defineAsyncComponent(() => import('@/components/icons/UserOutline.vue'))

/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */

const $shop = useShopStore()

const $route = useRoute()

/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */

const cartCounter = computed(() => {
  let counter = 0
  $shop.cart.forEach((offerCart) => {
    counter += offerCart.qty
  })
  return counter
})

const DRAWER_ID = ELEMENT_ID.DRAWER_LEFT

const navButtons = computed<IconLabelLink[]>(() => {
  return [
    { icon: HomeOutline, label: 'Inicio', to: { name: ROUTES.HOME } },
    {
      icon: SquaresOutline,
      label: 'Encargos',
      to: { name: ROUTES.INCOMMING }
    },
    {
      icon: ShoppingBagOutline,
      label: 'Carrito',
      to: { name: ROUTES.CARET },
      badge: cartCounter.value
    }
  ]
})

/**
 -------------------------------------------
 *	Lifecycle
 -------------------------------------------
 */

onMounted(() => {
  setTimeout(() => {
    initDrawers()
  }, 1000)
})
</script>

<template>
  <div class="fixed bottom-3 left-1/2 z-30 h-14 w-full max-w-lg -translate-x-1/2 px-2">
    <div class="rounded-full border border-gray-100 bg-white py-2 shadow-md">
      <div class="mx-auto grid h-full max-w-lg grid-cols-4">
        <RouterLink
          v-for="(btn, index) in navButtons"
          :key="`bottom-navbar-button-${index}`"
          :to="btn.to"
          type="button"
          class="group relative inline-flex flex-col items-center justify-center space-y-0.5 px-5"
        >
          <component
            :is="btn.icon"
            class="text-gray-600 transition-[color]"
            :class="[$route.name == btn.to.name ? 'h-8 w-8' : 'h-6 w-6']"
          />

          <div
            v-if="$route.name != btn.to.name"
            class="text-xs tracking-wide text-gray-600 transition-colors group-hover:text-gray-800"
          >
            {{ btn.label }}
          </div>

          <div
            v-if="btn.badge"
            class="absolute -top-2 right-2 inline-flex items-center justify-center rounded-full bg-primary px-1 py-0 text-sm font-medium text-white"
          >
            {{ btn.badge }}
          </div>
        </RouterLink>

        <button
          :data-drawer-target="DRAWER_ID"
          :data-drawer-toggle="DRAWER_ID"
          :aria-controls="DRAWER_ID"
          class="group relative inline-flex flex-col items-center justify-center space-y-0.5 px-5"
        >
          <UserOutline class="h-5 w-5 text-gray-600 transition-[color]" />
          <div
            class="text-xs tracking-wide text-gray-600 transition-colors group-hover:text-gray-800"
          >
            Cuenta
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
