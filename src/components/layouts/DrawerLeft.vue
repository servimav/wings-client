<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, ref } from 'vue'
import { type RouteLocationRaw, useRouter } from 'vue-router'
import { checkVersion, CURRENT_VERSION, ELEMENT_ID, useCapacitor } from '@/helpers'
import { ROUTES } from '@/router'
import { useAppStore, useUserStore } from '@/stores'
import { useServices } from '@/services'
// Components
const ArrowPath = defineAsyncComponent(() => import('@/components/icons/ArrowPath.vue'))
const ArrowRightRectangle = defineAsyncComponent(
  () => import('@/components/icons/ArrowRightRectangle.vue')
)
const CartIcon = defineAsyncComponent(() => import('@/components/icons/ShoppingCartOutline.vue'))
const WhatsApp = defineAsyncComponent(() => import('@/components/icons/WhatsApp.vue'))
const CheckBadge = defineAsyncComponent(() => import('@/components/icons/CheckBadge.vue'))
const HelpIcon = defineAsyncComponent(() => import('@/components/icons/HelpCircle.vue'))
const ShareIcon = defineAsyncComponent(() => import('@/components/icons/ShareOutline.vue'))
const SquaresIcon = defineAsyncComponent(() => import('@/components/icons/SquaresPlus.vue'))
const UserIcon = defineAsyncComponent(() => import('@/components/icons/UserOutline.vue'))

const elementId = ELEMENT_ID.DRAWER_LEFT

interface Application {
  id: number
  name: string
  version: string
}

interface MenuItem {
  to?: RouteLocationRaw
  label: string
  icon: typeof UserIcon
  badge?: string
  external?: string
}
/**
 * -----------------------------------------
 *	Helpers
 * -----------------------------------------
 */
const { canShare, share } = useCapacitor()
const { api } = useServices()
const $app = useAppStore()
const $router = useRouter()
const $user = useUserStore()
/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */

const apkUrl = 'https://api.wings.servimav.com/download-app/2'

const updateVersion = ref<string>()

const shareIsSupported = (await canShare()).value

const drawerItems: MenuItem[] = [
  {
    icon: UserIcon,
    label: 'Perfil',
    to: { name: ROUTES.USER }
  },
  {
    icon: CartIcon,
    label: 'Pedidos',
    // badge: '5',
    to: { name: ROUTES.ORDERS }
  },
  {
    icon: SquaresIcon,
    label: 'Nuevos Productos',
    // badge: '5',
    to: { name: ROUTES.FILTER }
  },
  {
    icon: HelpIcon,
    label: 'Ayuda',
    // badge: '5',
    to: { name: ROUTES.HELP }
  },
  {
    icon: WhatsApp,
    label: 'Contacto',
    // badge: '5',
    external: 'https://wa.me/17372811360'
  }
]

const profile = computed(() => $user.user)

/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */
/**
 * getAppUpdates
 */
async function getAppUpdates() {
  try {
    const { data } = await api.get<Application>('/app/current')
    const lowerVersion = checkVersion(data.version, CURRENT_VERSION) >= 1
    console.log({ data, CURRENT_VERSION, lowerVersion })

    if (lowerVersion) {
      updateVersion.value = data.version
    } else {
      updateVersion.value = undefined
    }
  } catch (error) {
    $app.axiosError(error)
  }
}
/**
 * goTo
 * @param to
 */
function goTo(item: MenuItem) {
  if (item.external) window.location.assign(item.external)
  else if (item.to) $router.push(item.to)
}

/**
 * logout
 */
function logout() {
  $user.logout()
  $router.push({ name: ROUTES.LOGIN })
}

/**
 * shareApp
 */
function shareApp() {
  share({
    dialogTitle: 'Compartir Wings',
    text: 'Aplicación de Compras y Envíos Wings\nGran variedad de productos y con precios excelentes',
    url: apkUrl,
    title: 'Compras y Envíos Wings'
  })
}

onBeforeMount(() => {
  getAppUpdates()
})
</script>

<template>
  <aside
    :id="elementId"
    class="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full border-r border-gray-200 bg-white pt-6 text-gray-800 transition-transform dark:border-gray-700 dark:bg-gray-800 sm:translate-x-0"
    aria-label="Sidebar"
  >
    <div class="h-full overflow-y-auto px-3 pb-4 dark:bg-gray-800">
      <!-- Profile Info -->
      <div class="rounded-xl border p-4 shadow-sm">
        <p>{{ profile?.name }}</p>
        <div class="flex items-center gap-2">
          <CheckBadge
            v-if="profile?.phone_verified_at"
            class="inline-block h-5 w-5 text-green-700"
          />
          <p>{{ profile?.phone }}</p>
        </div>
      </div>
      <!-- / Profile Info -->
      <!-- Links -->
      <ul class="mt-4 space-y-2 rounded-lg border p-2 font-medium shadow-sm">
        <li
          v-for="(item, itemKey) in drawerItems"
          :key="`draweri-item-${itemKey}`"
          @click="() => goTo(item)"
          :data-drawer-target="elementId"
          :data-drawer-toggle="elementId"
          class="no-select flex cursor-pointer items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
        >
          <component :is="item.icon" class="h-6 w-6 flex-shrink-0" />
          <span class="ml-3 flex-1 whitespace-nowrap">{{ item.label }}</span>
          <span
            v-if="item.badge"
            class="ml-3 inline-flex h-3 w-3 items-center justify-center rounded-full bg-blue-100 p-3 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            >{{ item.badge }}</span
          >
        </li>
        <!-- Share -->
        <li
          v-if="shareIsSupported"
          @click="shareApp"
          :data-drawer-target="elementId"
          :data-drawer-toggle="elementId"
          class="no-select flex cursor-pointer items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
        >
          <ShareIcon class="h-6 w-6 flex-shrink-0" />
          <span class="ml-3 flex-1 whitespace-nowrap">Compartir</span>
        </li>
        <!-- / Share -->

        <!-- Update -->
        <li v-if="updateVersion" :data-drawer-target="elementId" :data-drawer-toggle="elementId">
          <a
            :href="apkUrl"
            class="no-select flex cursor-pointer items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            target="_blank"
          >
            <ArrowPath class="h-6 w-6 flex-shrink-0" />
            <span class="ml-3 flex-1 whitespace-nowrap">Actualizar</span>
            <span
              class="ml-3 inline-flex items-center justify-center rounded-full bg-blue-100 p-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            >
              v{{ updateVersion }}
            </span>
          </a>
        </li>
        <!-- / Update -->

        <!-- Logout -->
        <li
          @click="logout"
          :data-drawer-target="elementId"
          :data-drawer-toggle="elementId"
          class="no-select flex cursor-pointer items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
        >
          <ArrowRightRectangle class="h-6 w-6 flex-shrink-0" />
          <span class="ml-3 flex-1 whitespace-nowrap">Salir</span>
        </li>
        <!-- / Logout -->
      </ul>
      <!-- / Links -->
    </div>
  </aside>
</template>
