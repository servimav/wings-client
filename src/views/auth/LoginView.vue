<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ROUTES } from '@/router'
import { useAppStore, useUserStore } from '@/stores'
import type { UserLogin } from '@servimav/wings-services'
/**
 * --------------------------------------------
 * Components
 * --------------------------------------------
 */
const EyeOutline = defineAsyncComponent(() => import('@/components/icons/EyeOutline.vue'))
const EyeSlashOutline = defineAsyncComponent(() => import('@/components/icons/EyeSlashOutline.vue'))
/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */
const $app = useAppStore()
const $router = useRouter()
const $user = useUserStore()

/**
 * --------------------------------------------
 * Data
 * --------------------------------------------
 */
const form = ref<UserLogin>({
  password: '',
  phone: ''
})
const showPassword = ref(false)
const passwordIcon = computed(() => (showPassword.value ? EyeSlashOutline : EyeOutline))
const passwordType = computed(() => (showPassword.value ? 'text' : 'password'))
/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */

async function submit() {
  try {
    const resp = await $user.authLogin(form.value)
    $app.success(`Bienvenido ${resp.user.name}`)
    void $router.push({
      name: ROUTES.HOME
    })
  } catch (error) {
    $app.axiosError(error)
  }
}
</script>

<template>
  <div class="rounded-t-xl bg-white py-5">
    <div class="mx-auto h-full max-w-sm px-6 py-3">
      <h1 class="mb-4 text-xl font-semibold text-gray-800">Inicia sesión</h1>
      <!-- Form -->
      <form class="space-y-4" @submit="submit">
        <!-- Phone number -->
        <div>
          <label for="phone-number" class="sr-only mb-2 block text-sm text-gray-800">Móvil</label>
          <input
            type="tel"
            name="phone-number"
            id="phone-number"
            class="w-full rounded-lg border border-gray-200 p-2 text-sm text-gray-600 outline-none placeholder:text-gray-500 focus:ring-1 focus:ring-gray-400"
            placeholder="Móvil"
            required
            v-model="form.phone"
          />
        </div>
        <!-- / Phone number -->

        <!-- Password -->
        <div>
          <label for="password" class="sr-only mb-2 block text-sm text-gray-800">Contraseña</label>
          <div class="relative">
            <div class="absolute inset-y-0 right-0 flex items-center pr-2">
              <Component
                :is="passwordIcon"
                class="h-[20px] w-[20px] cursor-pointer text-gray-500"
                @click="showPassword = !showPassword"
              />
            </div>
            <input
              :type="passwordType"
              name="password"
              id="password"
              placeholder="Contraseña"
              class="w-full rounded-lg border border-gray-200 p-2 text-sm text-gray-600 outline-none placeholder:text-gray-500 focus:ring-1 focus:ring-gray-500"
              required
              v-model="form.password"
            />
          </div>
        </div>
        <!-- / Password  -->

        <div class="float-right">
          <RouterLink
            :to="{ name: ROUTES.HOME }"
            class="text-sm text-gray-500 transition-colors hover:text-gray-700"
          >
            Olvidaste tu contraseña?</RouterLink
          >
        </div>
        <button
          type="submit"
          class="inline-flex w-full items-center justify-center rounded-lg bg-butterfly-blue-500 px-5 py-2.5 font-medium text-white transition-colors hover:bg-butterfly-blue-600 focus:outline-none focus:ring-4 focus:ring-butterfly-blue-100 focus:ring-offset-1"
        >
          Iniciar
        </button>
        <p class="text-sm text-gray-500">
          Aún no tienes cuenta?
          <RouterLink :to="{ name: ROUTES.REGISTER }" class="font-medium text-butterfly-blue-500"
            >Regístrate</RouterLink
          >
        </p>
      </form>
      <!-- / Form -->
    </div>
  </div>
</template>
