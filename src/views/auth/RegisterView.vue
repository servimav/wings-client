<script setup lang="ts">
import { ROUTES } from '@/router'
import { computed, defineAsyncComponent, ref } from 'vue'
/**
 * --------------------------------------------
 * Components
 * --------------------------------------------
 */
const EyeOutline = defineAsyncComponent(() => import('@/components/icons/EyeOutline.vue'))
const EyeSlashOutline = defineAsyncComponent(() => import('@/components/icons/EyeSlashOutline.vue'))

/**
 * --------------------------------------------
 * Data
 * --------------------------------------------
 */
const showPassword = ref(false)
const showPasswordConfirm = ref(false)

const passwordIcon = computed(() => (showPassword.value ? EyeSlashOutline : EyeOutline))
const passwordConfirmIcon = computed(() =>
  showPasswordConfirm.value ? EyeSlashOutline : EyeOutline
)
const passwordType = computed(() => (showPassword.value ? 'text' : 'password'))
const passwordConfirmType = computed(() => (showPasswordConfirm.value ? 'text' : 'password'))
const form = ref({ name: '', phoneNumber: '', password: '', passwordConfirm: '' })

function submit() {
  console.log('Submit form')
}
</script>
<template>
  <div class="rounded-t-xl bg-white py-5">
    <div class="mx-auto h-full max-w-sm px-6 py-3">
      <h1 class="mb-4 text-xl font-semibold text-gray-800">Crea tu cuenta</h1>

      <form class="space-y-4" @submit="submit">
        <!-- Name -->
        <div>
          <label for="name" class="sr-only mb-2 block text-sm text-gray-800">Nombre</label>
          <input
            type="text"
            name="name"
            id="name"
            class="w-full rounded-lg border border-gray-200 p-2 text-sm text-gray-600 outline-none placeholder:text-gray-500 focus:ring-1 focus:ring-gray-400"
            placeholder="Nombre"
            required
            v-model="form.name"
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
            class="w-full rounded-lg border border-gray-200 p-2 text-sm text-gray-600 outline-none placeholder:text-gray-500 focus:ring-1 focus:ring-gray-400"
            placeholder="Móvil"
            required
            v-model="form.phoneNumber"
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
              class="w-full rounded-lg border border-gray-200 p-2 text-sm text-gray-600 outline-none placeholder:text-gray-500 focus:ring-1 focus:ring-gray-500"
              required
              v-model="form.passwordConfirm"
            />
          </div>
        </div>
        <!-- / Password confirm  -->

        <button
          type="submit"
          class="inline-flex w-full items-center justify-center rounded-lg bg-butterfly-blue-500 px-5 py-2.5 font-medium text-white transition-colors hover:bg-butterfly-blue-600 focus:outline-none focus:ring-4 focus:ring-butterfly-blue-100 focus:ring-offset-1"
        >
          Iniciar
        </button>
        <p class="text-sm text-gray-500">
          Ya tienes cuenta?
          <RouterLink :to="{ name: ROUTES.LOGIN }" class="font-medium text-butterfly-blue-500"
            >Inicia sesión</RouterLink
          >
        </p>
      </form>
      <!-- / Form -->
    </div>
  </div>
</template>