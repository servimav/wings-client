<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router'
import { ROUTES } from '@/router/names'
import Icon from '@/components/Icon.vue'
import { home, squares2x2, shoppingCart, shoppingBag, user, type IconSVG } from '@/helpers/icon'

interface Link {
  label: string
  to: RouteLocationRaw
}

interface IconLink extends Link {
  icon: IconSVG
}

const BUTTONS: Array<IconLink> = [
  { icon: home, label: 'Inicio', to: { name: ROUTES.HOME } },
  { icon: squares2x2, label: 'Categorías', to: { name: ROUTES.CATEGORIES } },
  { icon: shoppingCart, label: 'Carrito', to: { name: ROUTES.CARET } },
  { icon: shoppingBag, label: 'Pedidos', to: { name: ROUTES.ORDERS } },
  { icon: user, label: 'Cuenta', to: { name: ROUTES.USER } }
]
</script>
<template>
  <div class="fixed z-10 w-full h-16 max-w-lg bg-white bottom-4">
    <div class="grid h-full max-w-lg grid-cols-5 mx-auto">
      <RouterLink
        v-for="({ icon, label, to }, index) in BUTTONS"
        :key="`bottom-navbar-button-${index}`"
        :to="to"
        type="button"
        class="inline-flex flex-col items-center justify-center px-5 rounded-l-full hover:bg-gray-50 group"
      >
        <Icon v-bind="icon" class="w-7 h-7 mb-1 text-gray-600 group-hover:text-blue-600" />
        <div class="text-xs tracking-widest text-gray-600 group-hover:text-blue-600">
          {{ label }}
        </div>
      </RouterLink>
    </div>
  </div>
</template>
