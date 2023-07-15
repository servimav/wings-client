<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ROUTES } from '@/router'
import { useAppStore, useUserStore } from '@/stores'
import type { UserRegister } from '@servimav/wings-services'
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
const form = ref<UserRegister>({
  name: '',
  password: '',
  password_confirmation: '',
  phone: ''
})

const passwordIcon = computed(() => (showPassword.value ? EyeSlashOutline : EyeOutline))
const passwordConfirmIcon = computed(() =>
  showPasswordConfirm.value ? EyeSlashOutline : EyeOutline
)
const passwordType = computed(() => (showPassword.value ? 'text' : 'password'))
const passwordConfirmType = computed(() => (showPasswordConfirm.value ? 'text' : 'password'))

const showPassword = ref(false)
const showPasswordConfirm = ref(false)
/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */
/**
 * submit
 */
async function submit() {
  $app.toggleLoading(true)
  try {
    const resp = await $user.authRegister(form.value)
    $app.success(`Bienvenido ${resp.data.name}`)
    $router.push({
      name: ROUTES.HOME
    })
  } catch (error) {
    $app.axiosError(error)
  }
  $app.toggleLoading(false)
}
</script>
<template>
  <div class="rounded-t-xl bg-white py-5">
    <div class="mx-auto h-full max-w-sm px-6 py-3">
      <h1 class="mb-4 text-xl font-medium text-gray-800">Crea tu cuenta</h1>

      <form class="space-y-4" @submit.prevent="submit">
        <!-- Name -->
        <div>
          <label for="name" class="sr-only mb-2 block text-sm text-gray-800">Nombre</label>
          <input
            type="text"
            name="name"
            id="name"
            class="input block w-full p-2.5"
            placeholder="Nombre"
            required
            :value="form.name"
            @input.prevent="($event) => form.name = ($event.target as HTMLInputElement).value"
          />
        </div>
        <!-- / Name -->

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
        <!-- / Password -->

        <!-- Password confirm -->
        <div>
          <label for="password-confirm" class="sr-only mb-2 block text-sm text-gray-800"
            >Confirmar contraseña</label
          >
          <div class="relative">
            <div class="absolute inset-y-0 right-0 flex items-center pr-2">
              <Component
                :is="passwordConfirmIcon"
                class="h-[20px] w-[20px] cursor-pointer text-gray-500"
                @click="showPasswordConfirm = !showPasswordConfirm"
              />
            </div>
            <input
              :type="passwordConfirmType"
              name="password-confirm"
              id="password-confirm"
              placeholder="Confirmar Contraseña"
              class="input block w-full p-2.5"
              required
              :value="form.password_confirmation"
              @input.prevent="($event) => form.password_confirmation = ($event.target as HTMLInputElement).value"
            />
          </div>
        </div>
        <!-- / Password confirm  -->

        <button
          type="submit"
          class="inline-flex w-full items-center justify-center rounded-lg bg-primary-500 px-5 py-2.5 text-lg font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 focus:ring-offset-1"
        >
          Iniciar
        </button>
        <p class="text-gray-500">
          Ya tienes cuenta?
          <RouterLink :to="{ name: ROUTES.LOGIN }" class="font-medium text-primary-500"
            >Inicia sesión</RouterLink
          >
        </p>
      </form>
      <!-- / Form -->
    </div>
  </div>
</template>
