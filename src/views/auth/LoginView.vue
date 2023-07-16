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
/**
 * submit
 */
async function submit() {
  try {
    const resp = await $user.authLogin(form.value)
    $app.success(`Bienvenido ${resp.data.name}`)
    void $router.push({
      name: ROUTES.HOME
    })
  } catch (error) {
    $app.axiosError(error)
  }
}
</script>

<template>
  <div class="px-2 py-5">
    <div class="mx-auto max-w-sm px-4 py-3">
      <h1 class="mb-4 text-xl font-medium text-gray-800">Inicia sesión</h1>
      <!-- Form -->
      <form class="space-y-5" @submit.prevent="submit">
        <!-- Phone number -->
        <div>
          <label for="phone-number" class="sr-only mb-2 block text-sm text-gray-800">Móvil</label>
          <input
            type="tel"
            name="phone-number"
            id="phone-number"
            class="input block w-full p-2.5"
            placeholder="Móvil"
            required
            :value="form.phone"
            @input.prevent="($event) => form.phone = ($event.target as HTMLInputElement).value"
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
              class="input block w-full p-2.5"
              required
              :value="form.password"
              @input.prevent="($event) => form.password = ($event.target as HTMLInputElement).value"
            />
          </div>
        </div>
        <!-- / Password  -->

        <div class="float-right">
          <RouterLink
            :to="{ name: ROUTES.HOME }"
            class="text-gray-500 transition-colors hover:text-gray-700"
          >
            Olvidaste tu contraseña?</RouterLink
          >
        </div>
        <button
          type="submit"
          class="inline-flex w-full items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-lg font-medium text-white transition-colors hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary-light focus:ring-offset-1"
        >
          Iniciar
        </button>
        <p class="text-gray-500">
          Aún no tienes cuenta?
          <RouterLink :to="{ name: ROUTES.REGISTER }" class="font-medium text-primary"
            >Regístrate
          </RouterLink>
        </p>
      </form>
      <!-- / Form -->
    </div>
  </div>
</template>
