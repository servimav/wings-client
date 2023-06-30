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
const passwordIcon = computed(() => (showPassword.value ? EyeSlashOutline : EyeOutline))
const passwordType = computed(() => (showPassword.value ? 'text' : 'password'))
const form = ref({ phoneNumber: '', password: '' })

function submit() {
  console.log('Submit form')
}
</script>

<template>
  <div class="bg-white py-5 rounded-t-xl">
    <div class="max-w-sm h-full px-6 py-3 mx-auto">
      <h1 class="text-xl font-semibold text-gray-800 mb-4">Inicia sesión</h1>
      <!-- Form -->
      <form class="space-y-4" @submit="submit">
        <!-- Phone number -->
        <div>
          <label for="phone-number" class="sr-only block mb-2 text-sm text-gray-800">Móvil</label>
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
          <label for="password" class="sr-only block mb-2 text-sm text-gray-800">Contraseña</label>
          <div class="relative">
            <div class="absolute inset-y-0 right-0 pr-2 flex items-center">
              <Component
                :is="passwordIcon"
                class="w-[20px] h-[20px] text-gray-500 cursor-pointer"
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
            class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >Olvidaste tu contraseña?</RouterLink
          >
        </div>
        <button
          type="submit"
          class="inline-flex w-full items-center justify-center rounded-lg bg-butterfly-blue-500 px-5 py-2.5 font-medium text-white transition-colors hover:bg-butterfly-blue-600 focus:outline-none focus:ring-offset-1 focus:ring-4 focus:ring-butterfly-blue-100"
        >
          Iniciar
        </button>
        <p class="text-sm text-gray-500">
          Aún no tienes cuenta?
          <RouterLink :to="{ name: ROUTES.REGISTER }" class="text-butterfly-blue-500 font-medium"
            >Regístrate</RouterLink
          >
        </p>
      </form>
      <!-- / Form -->
    </div>
  </div>
</template>
