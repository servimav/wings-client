<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { type RouteLocationRaw, useRouter } from 'vue-router'
import { ELEMENT_ID } from '@/helpers'
import { ROUTES } from '@/router'
// Components
const UserIcon = defineAsyncComponent(() => import('@/components/icons/UserOutline.vue'))

const elementId = ELEMENT_ID.DRAWER_LEFT

interface MenuItem {
  to?: RouteLocationRaw
  label: string
  icon: typeof UserIcon
  badge?: string
}
/**
 * -----------------------------------------
 *	Helpers
 * -----------------------------------------
 */
const $router = useRouter()
/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */
const drawerItems: MenuItem[] = [
  {
    icon: UserIcon,
    label: 'Inicio',
    to: { name: ROUTES.HOME }
  },
  {
    icon: UserIcon,
    label: 'Categorías',
    // badge: '5',
    to: { name: ROUTES.HOME }
  },
  {
    icon: UserIcon,
    label: 'Anuncios',
    // badge: '5',
    to: { name: ROUTES.HOME }
  },
  {
    icon: UserIcon,
    label: 'Tiendas',
    to: { name: ROUTES.HOME }
  },
  {
    icon: UserIcon,
    label: 'Productos',
    to: { name: ROUTES.HOME }
  },
  {
    icon: UserIcon,
    label: 'Pedidos',
    to: { name: ROUTES.ORDERS }
  },
  {
    icon: UserIcon,
    label: 'Usuarios',
    to: { name: ROUTES.HOME }
  },
  {
    icon: UserIcon,
    label: 'Mensajes',
    badge: '10',
    to: { name: ROUTES.HOME }
  },
  {
    icon: UserIcon,
    label: 'Ajustes'
  }
]

/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */
/**
 * goTo
 * @param to
 */
function goTo(to?: RouteLocationRaw) {
  if (to) void $router.push(to)
}
</script>

<template>
  <aside
    :id="elementId"
    class="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full border-r border-gray-200 bg-white pt-6 transition-transform dark:border-gray-700 dark:bg-gray-800 sm:translate-x-0"
    aria-label="Sidebar"
  >
    <div class="h-full overflow-y-auto bg-white px-3 pb-4 dark:bg-gray-800">
      <ul class="space-y-2 font-medium">
        <li
          v-for="(item, itemKey) in drawerItems"
          :key="`draweri-item-${itemKey}`"
          @click="() => goTo(item.to)"
          :data-drawer-target="elementId"
          :data-drawer-toggle="elementId"
          class="flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
        >
          <component :is="item.icon" class="h-6 w-6 flex-shrink-0" />
          <span class="ml-3 flex-1 whitespace-nowrap">{{ item.label }}</span>
          <span
            v-if="item.badge"
            class="ml-3 inline-flex h-3 w-3 items-center justify-center rounded-full bg-blue-100 p-3 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            >{{ item.badge }}</span
          >
        </li>
      </ul>
    </div>
  </aside>
</template>
