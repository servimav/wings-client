<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'

/**
 *******************************************
 *	Components
 *******************************************
 */
const StepperInline = defineAsyncComponent(() => import('@/components/StepperInline.vue'))
const SelectInput = defineAsyncComponent(() => import('@/components/forms/inputs/SelectInput.vue'))
const TextInput = defineAsyncComponent(() => import('@/components/forms/inputs/TextInput.vue'))

/**
 *******************************************
 *	Data
 *******************************************
 */
interface Destinatary {
  place: string
  name: string
  phoneNumber: string
  address: string
}
const form = ref<Destinatary>({
  place: 'cienfuegos',
  name: '',
  phoneNumber: '',
  address: ''
})
const activeStep = ref(0)

/**
 * Constants
 */
const PLACES_OPTIONS: Array<{ label: string; value: string | number }> = [
  { label: 'Cienfuegos', value: 'cienfuegos' },
  { label: 'Cumanayagua', value: 'cumanayagua' },
  { label: 'Palmira', value: 'palmira' }
]
const STEP_LABELS: Array<string> = ['Destinatario', 'Revisión', 'Completado']

/**
 *******************************************
 * Methods
 *******************************************
 */
function submit() {
  console.log('Submit')
}
</script>

<template>
  <main class="container w-full bg-gray-50 select-none">
    <div class="fixed w-full left-0 top-12 bg-white pt-5 pb-2">
      <StepperInline :labels="STEP_LABELS" :active="activeStep" />
    </div>

    <div class="px-2 pt-36 pb-5">
      <div class="bg-white rounded-lg shadow p-3">
        <h4 class="text-gray-500 font-medium mb-2">Formulario del destinatario</h4>
        <form class="space-y-4" @submit.prevent="submit">
          <div>
            <SelectInput
              id="place"
              v-model="form.place"
              :options="PLACES_OPTIONS"
              label="Lugar de destino"
              required
            />
          </div>

          <div>
            <TextInput
              v-model="form.name"
              id="name"
              type="text"
              label="Nombre completo"
              placeholder="Nombres y apellidos"
              required
            />
          </div>

          <div>
            <TextInput
              v-model="form.phoneNumber"
              id="phone-number"
              type="tel"
              label="Número de teléfono"
              placeholder="********"
              required
            />
          </div>

          <div>
            <TextInput
              v-model="form.address"
              id="address"
              type="textarea"
              :rows="2"
              label="Dirección"
              placeholder="Provincia, Municipio, Calle, etc."
              required
            />
          </div>
          <div class="w-full">
            <button
              class="inline-flex w-full max-w-sm items-center justify-center rounded-lg bg-butterfly-blue-500 text-white px-5 py-2.5 font-medium transition-colors hover:bg-butterfly-blue-600 focus:outline-none focus:ring-4 focus:ring-butterfly-blue-100 focus:ring-offset-1"
            >
              Confirmar y continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>
