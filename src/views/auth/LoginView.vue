<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ROUTES } from '@/router'
import { useAppStore, useUserStore } from '@/stores'
import type { UserLogin } from '@servimav/wings-services'
import { sendWhatsappMessage } from '@/helpers'

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
    $app.axiosError(error, 'Credenciales incorrectas')
  }
}

/**
 * contactWhatsapp
 */
function contactWhatsapp() {
  const message = 'Necesito ayuda'
  sendWhatsappMessage({ message })
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
          <label for="phone" class="sr-only mb-2 block text-sm text-gray-800">Móvil</label>
          <input
            type="tel"
            name="phone"
            id="phone"
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

        <div class="float-right">
          <a target="_blank" class="text-link" @click="contactWhatsapp">
            Olvidaste tu contraseña?</a
          >
        </div>
        <button type="submit" class="btn btn-lg btn-primary w-full">Entrar</button>
        <p class="text-gray-500">
          Aún no tienes cuenta?
          <RouterLink :to="{ name: ROUTES.REGISTER }" class="text-link"> Regístrate </RouterLink>
        </p>
      </form>
      <!-- / Form -->
    </div>
  </div>
</template>
