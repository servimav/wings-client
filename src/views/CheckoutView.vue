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
  <main class="container w-full select-none px-2 pt-[4.5rem]">
    <StepperInline :labels="STEP_LABELS" :active="activeStep" class="mb-4" />
    <div class="px-2">
      <div class="mb-4 space-y-1">
        <h4 class="text-lg text-gray-800">Formulario del destinatario</h4>
        <div class="text-sm text-gray-500">
          Es necesario completar todos los campos para pasar a la revisión del pedido.
        </div>
      </div>

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
            :rows="3"
            label="Dirección"
            placeholder="Provincia, Municipio, Calle, etc."
            required
          />
        </div>
      </form>
    </div>
    <div class="fixed bg-white bottom-2 left-0 w-full p-2">
      <button
        class="inline-flex w-full items-center justify-center rounded-lg bg-butterfly-blue-500 px-5 py-2.5 font-medium text-white transition-colors hover:bg-butterfly-blue-600 focus:outline-none focus:ring-4 focus:ring-butterfly-blue-100 focus:ring-offset-1"
      >
        Confirmar y continuar
      </button>
    </div>
  </main>
</template>
