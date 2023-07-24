<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, ref } from 'vue'
import { type RouteLocationRaw, useRouter } from 'vue-router'
import { checkVersion, CURRENT_VERSION, ELEMENT_ID, useCapacitor } from '@/helpers'
import { ROUTES } from '@/router'
import { useAppStore, useUserStore } from '@/stores'
import { useServices } from '@/services'

/**
 -------------------------------------------
 *	Types
 -------------------------------------------
 */

interface Application {
  id: number
  name: string
  version: string
}

interface MenuLink {
  to: RouteLocationRaw
  label: string
  icon: typeof UserIcon
  badge?: string
}

interface MenuExternalLink extends Omit<MenuLink, 'to'> {
  url: string
}

/**
 -------------------------------------------
 *	Components
 -------------------------------------------
 */
const UserCircleOutline = defineAsyncComponent(
  () => import('@/components/icons/UserCircleOutline.vue')
)
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

/**
 * -----------------------------------------
 *	Composables
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

const ID = ELEMENT_ID.DRAWER_LEFT

const apkUrl = 'https://api.wings.servimav.com/download-app/2'

const updateVersion = ref<string | undefined>()

const shareIsSupported = (await canShare()).value

const internalLinks: MenuLink[] = [
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
    to: {
      name: ROUTES.FILTER,
      query: {
        currency: 'CUP'
      }
    }
  },
  {
    icon: HelpIcon,
    label: 'Ayuda',
    to: { name: ROUTES.HELP }
  }
]

const externalLinks: MenuExternalLink[] = [
  {
    icon: WhatsApp,
    label: 'Contacto',
    url: 'https://wa.me/17372811360'
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
 * logout
 */
function logout() {
  $user.logout()
  $router.push({ name: ROUTES.LOGIN })
}

/**
 * goTo
 * @param url
 */
function goTo(url: string) {
  window.location.assign(url)
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

/**
 -------------------------------------------
 *	Lifecyle
 -------------------------------------------
 */

onBeforeMount(() => {
  getAppUpdates()
})
</script>

<template>
  <aside
    :id="ID"
    class="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full rounded-r-2xl border-r border-gray-200 bg-white pt-2 text-gray-800 transition-transform"
    aria-label="Sidebar"
  >
    <div class="h-full overflow-y-auto px-1 py-4">
      <!-- Profile Info -->
      <template v-if="profile">
        <div class="mb-4 flex items-center rounded-2xl p-2">
          <UserCircleOutline class="h-10 w-10 text-gray-500" />
          <div class="ml-2">
            <p class="text-gray-800">{{ profile.name }}</p>
            <div class="flex items-center gap-2">
              <CheckBadge
                v-if="profile?.phone_verified_at"
                class="inline-block h-5 w-5 text-green-700"
              />
              <p class="text-gray-500">{{ profile.phone }}</p>
            </div>
          </div>
        </div>
        <hr class="border-gray-200" />
      </template>
      <!-- / Profile Info -->

      <!-- Links -->
      <ul class="space-y-2 p-2" :class="{ 'mt-4': profile }">
        <!-- Internals -->
        <li
          v-for="(link, linkIndex) in internalLinks"
          :key="`drawer-link-${linkIndex}`"
          class="no-select text-gray-500"
        >
          <RouterLink
            :to="link.to"
            :data-drawer-target="ID"
            :data-drawer-hide="ID"
            class="flex items-center rounded-xl p-2.5"
            active-class="text-gray-900 bg-gray-100"
          >
            <component :is="link.icon" class="h-6 w-6 flex-shrink-0 text-gray-800" />
            <span class="ml-3 flex-1 whitespace-nowrap">{{ link.label }}</span>
            <span v-if="link.badge" class="badge ml-3 rounded-full bg-blue-100 text-blue-500">{{
              link.badge
            }}</span>
          </RouterLink>
        </li>
        <!-- / Internals -->

        <!-- Externals -->
        <li
          v-for="(link, linkIndex) in externalLinks"
          :key="`drawer-link-${linkIndex}`"
          :data-drawer-target="ID"
          :data-drawer-hide="ID"
          class="no-select flex cursor-pointer items-center rounded-lg px-3 py-2 text-gray-500"
          @click="() => goTo(link.url)"
        >
          <component :is="link.icon" class="h-6 w-6 flex-shrink-0 text-gray-800" />
          <span class="ml-3 flex-1 whitespace-nowrap">{{ link.label }}</span>
          <span v-if="link.badge" class="badge ml-3 rounded-full bg-blue-100 text-blue-500">{{
            link.badge
          }}</span>
        </li>
        <!-- / Externals -->

        <!-- Share -->
        <li
          v-if="shareIsSupported"
          @click="shareApp"
          :data-drawer-target="ID"
          :data-drawer-hide="ID"
          class="no-select flex cursor-pointer items-center rounded-lg p-2.5 text-gray-500 hover:bg-gray-200"
        >
          <ShareIcon class="h-6 w-6 flex-shrink-0 text-gray-800" />
          <span class="ml-3 flex-1 whitespace-nowrap">Compartir</span>
        </li>
        <!-- / Share -->

        <!-- Update -->
        <li v-if="updateVersion" :data-drawer-target="ID" :data-drawer-hide="ID">
          <a
            :href="apkUrl"
            class="no-select flex cursor-pointer items-center rounded-lg p-2.5 text-gray-500 hover:bg-gray-200"
            target="_blank"
          >
            <ArrowPath class="h-6 w-6 flex-shrink-0 text-gray-800" />
            <span class="ml-3 flex-1 whitespace-nowrap">Actualizar</span>
            <span class="badge ml-3 rounded-full bg-blue-100 text-blue-500">
              v{{ updateVersion }}
            </span>
          </a>
        </li>
        <!-- / Update -->

        <!-- Logout -->
        <li
          @click="logout"
          :data-drawer-target="ID"
          :data-drawer-hide="ID"
          class="no-select flex cursor-pointer items-center rounded-lg p-2.5 text-gray-500 hover:bg-gray-200"
        >
          <ArrowRightRectangle class="h-6 w-6 flex-shrink-0 text-gray-800" />
          <span class="ml-3 flex-1 whitespace-nowrap">Salir</span>
        </li>
        <!-- / Logout -->
      </ul>
      <!-- / Links -->
    </div>
  </aside>
</template>
