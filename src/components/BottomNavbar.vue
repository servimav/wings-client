<script lang="ts" setup>
import { useRoute, type RouteLocationRaw } from 'vue-router'
import { ROUTES } from '@/router/names'
import Icon from '@/components/Icon.vue'
import {
  squares2x2Outline,
  shoppingBagOutline,
  userOutline,
  type IconSVG,
  heartOutline
} from '@/helpers/icon'

interface Link {
  to: RouteLocationRaw
}

interface LabelLink extends Link {
  label: string
}

interface IconLabelLink extends LabelLink {
  icon: IconSVG
}

const BUTTONS: Array<IconLabelLink> = [
  { icon: heartOutline, label: 'Inicio', to: { name: ROUTES.HOME } },
  {
    icon: squares2x2Outline,
    label: 'Categorías',
    to: { name: ROUTES.CATEGORIES }
  },
  {
    icon: shoppingBagOutline,
    label: 'Pedidos',
    to: { name: ROUTES.ORDERS }
  },
  { icon: userOutline, label: 'Cuenta', to: { name: ROUTES.USER } }
]

const route = useRoute()
</script>
<template>
  <div class="fixed z-50 w-full h-14 max-w-lg -translate-x-1/2 bottom-3 left-1/2 px-2">
    <div class="bg-white border border-gray-200 rounded-full py-2">
      <div class="grid h-full max-w-lg grid-cols-4 mx-auto">
        <RouterLink
          v-for="(btn, index) in BUTTONS"
          :key="`bottom-navbar-button-${index}`"
          :to="btn.to"
          type="button"
          class="inline-flex flex-col items-center justify-center px-5 group"
        >
          <Icon
            v-bind="btn.icon"
            :class="[
              route.name == btn.to.name
                ? 'h-8 w-8 text-sky-600'
                : 'h-6 w-6 text-gray-500 group-hover:text-gray-600'
            ]"
          />

          <div
            v-if="route.name != btn.to.name"
            class="text-xs tracking-wide"
            :class="[
              route.name == btn.to.name ? 'text-sky-600' : 'text-gray-500 group-hover:text-gray-600'
            ]"
          >
            {{ btn.label }}
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
