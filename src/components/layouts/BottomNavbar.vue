<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import { useRoute, type RouteLocationNamedRaw } from 'vue-router'
import { ROUTES } from '@/router/names'
/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */

const HeartOutline = defineAsyncComponent(() => import('@/components/icons/HeartOutline.vue'))
const SquaresOutline = defineAsyncComponent(
  () => import('@/components/icons/Squqres2x2Outline.vue')
)
const ShoppingBagOutline = defineAsyncComponent(
  () => import('@/components/icons/ShoppingBagOutline.vue')
)
const UserOutline = defineAsyncComponent(() => import('@/components/icons/UserOutline.vue'))

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
  icon: typeof HeartOutline
}
/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */

const BUTTONS: Array<IconLabelLink> = [
  { icon: HeartOutline, label: 'Inicio', to: { name: ROUTES.HOME } },
  {
    icon: SquaresOutline,
    label: 'Categorías',
    to: { name: ROUTES.UNDER_CONSTRUCTION }
  },
  {
    icon: ShoppingBagOutline,
    label: 'Pedidos',
    to: { name: ROUTES.UNDER_CONSTRUCTION }
  },
  { icon: UserOutline, label: 'Cuenta', to: { name: ROUTES.UNDER_CONSTRUCTION } }
]

const route = useRoute()
</script>

<template>
  <div class="fixed bottom-3 left-1/2 z-50 h-14 w-full max-w-lg -translate-x-1/2 px-2">
    <div class="rounded-full border border-gray-100 bg-white py-2 shadow-md">
      <div class="mx-auto grid h-full max-w-lg grid-cols-4">
        <RouterLink
          v-for="(btn, index) in BUTTONS"
          :key="`bottom-navbar-button-${index}`"
          :to="btn.to"
          type="button"
          class="group inline-flex flex-col items-center justify-center px-5"
        >
          <component
            :is="btn.icon"
            class="transition-[color]"
            :class="[
              route.name == btn.to
                ? 'h-8 w-8 fill-butterfly-blue stroke-transparent text-butterfly-blue'
                : 'h-6 w-6 text-gray-600 group-hover:text-gray-800'
            ]"
          />

          <div
            v-if="route.name != btn.to.name"
            class="text-xs tracking-wide transition-colors"
            :class="[
              route.name == btn.to.name
                ? 'text-butterfly-blue'
                : 'text-gray-600 group-hover:text-gray-800'
            ]"
          >
            {{ btn.label }}
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
