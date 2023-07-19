<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useUserStore } from '@/stores'
import { sendWhatsappMessage } from '@/helpers'
import { useRouter } from 'vue-router'
import { ROUTES } from '@/router'

/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */

const UserViewSkeleton = defineAsyncComponent(
  () => import('@/components/skeletons/UserViewSkeleton.vue')
)
const UserOutline = defineAsyncComponent(() => import('@/components/icons/UserOutline.vue'))
const PhoneOutline = defineAsyncComponent(() => import('@/components/icons/PhoneOutline.vue'))
const EnvelopeOutline = defineAsyncComponent(() => import('@/components/icons/EnvelopeOutline.vue'))
const IdentificationOutline = defineAsyncComponent(
  () => import('@/components/icons/IdentificationOutline.vue')
)
const CheckBadge = defineAsyncComponent(() => import('@/components/icons/CheckBadge.vue'))
const CalendarDaysOutline = defineAsyncComponent(
  () => import('@/components/icons/CalendarDaysOutline.vue')
)
const ChevronRight = defineAsyncComponent(() => import('@/components/icons/ChevronRight.vue'))

/**
 -------------------------------------------
 *	Composables
 -------------------------------------------
 */

const $user = useUserStore()
const $router = useRouter()
/**
 -------------------------------------------
 *	Data
 -------------------------------------------
 */

const profile = computed(() => $user.user)

/**
 -------------------------------------------
 *	Methods
 -------------------------------------------
 */

/**
 * contactWhatsapp
 */
function contactWhatsapp() {
  const message = 'Necesito ayuda'
  sendWhatsappMessage({ message })
}

/**
 * logout
 */
function logout() {
  $user.logout()
  $router.push({ name: ROUTES.LOGIN })
}

/**
 * formatDate
 * @param date text in date format
 */
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-ES', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <main class="container h-full min-h-screen w-full select-none bg-gray-50 px-4 pb-[4.5rem] pt-16">
    <!-- Main Content -->
    <template v-if="profile">
      <div
        class="relative mb-3 mt-10 rounded-lg border border-gray-200 bg-white px-4 pb-4 pt-8 text-gray-500"
      >
        <div
          class="absolute -top-8 left-1/2 mx-auto w-fit -translate-x-1/2 rounded-full border border-gray-200 bg-white p-3"
        >
          <UserOutline class="h-8 w-8 text-gray-500" />
        </div>
        <div class="font text-center text-lg text-gray-800">{{ profile.name }}</div>
        <div class="mt-4 space-y-4">
          <!-- Name -->
          <div class="flex items-center justify-between">
            <div class="flex items-center text-gray-500">
              <UserOutline class="h-5 w-5" />
              <span class="ml-1"> Nombre </span>
            </div>
            <div class="text-gray-800">{{ profile.name }}</div>
          </div>
          <!-- / Name -->

          <!-- Phone Number -->
          <div class="flex items-center justify-between">
            <div class="flex items-center text-gray-500">
              <PhoneOutline class="h-5 w-5" />
              <span class="ml-1"> Télefono </span>
            </div>
            <div class="text-gray-800">{{ profile.phone }}</div>
          </div>
          <!-- / Phone Number -->

          <!-- Email -->
          <div v-if="profile.email" class="flex items-center justify-between">
            <div class="flex items-center text-gray-500">
              <EnvelopeOutline class="h-5 w-5" />
              <span class="ml-1"> Correo </span>
            </div>
            <div class="text-gray-800">{{ profile.email }}</div>
          </div>
          <!-- / Email -->

          <!-- Phone Verified -->
          <div class="flex items-center justify-between">
            <div class="flex items-center text-gray-500">
              <IdentificationOutline class="h-5 w-5" />
              <span class="ml-1"> Usuario verificado </span>
            </div>
            <CheckBadge v-if="profile.phone_verified_at" class="h-5 w-5 text-green-700" />
            <div v-else class="text-gray-800">No</div>
          </div>
          <!-- / Phone Verified -->

          <!-- Register Date -->
          <div class="flex items-center justify-between">
            <div class="flex items-center text-gray-500">
              <CalendarDaysOutline class="h-5 w-5" />
              <span class="ml-1"> Registro </span>
            </div>
            <div class="text-gray-800">{{ formatDate(profile.created_at) }}</div>
          </div>
          <!-- / Register Date -->
        </div>
      </div>

      <!-- More Links -->
      <div class="relative rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-800">
        <div class="flex flex-col">
          <button
            type="button"
            class="flex items-center justify-between py-2"
            @click="contactWhatsapp"
          >
            <span> Contactar soporte</span>
            <ChevronRight class="h-5 w-5" />
          </button>
          <button type="button" @click="logout" class="flex items-center justify-between py-2">
            <span>Cerrar cuenta</span>
            <ChevronRight class="h-5 w-5" />
          </button>
          <a
            role="button"
            href="https://api.wings.servimav.com/terms"
            target="_blank"
            class="flex items-center justify-between py-2"
          >
            <span>Términos de servicio</span>
            <ChevronRight class="h-5 w-5" />
          </a>
        </div>
      </div>
      <!-- / More Links -->
    </template>
    <!-- / Main Content -->

    <UserViewSkeleton v-else class="mt-10" />
  </main>
</template>
