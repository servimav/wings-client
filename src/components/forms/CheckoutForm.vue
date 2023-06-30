<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, ref } from 'vue'
import type {
  DeliveryDetails,
  GeoLocation,
  ShopOrder,
  ShopOrderCreate
} from '@servimav/wings-services'
import { useAppStore, useShopStore } from '@/stores'
import { toCurrency, useStorage } from '@/helpers'
/**
 * -----------------------------------------
 *	Types
 * -----------------------------------------
 */
interface Emit {
  (e: 'completed', v: ShopOrder): void
  (e: 'cancel'): void
}
/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */
const SelectInput = defineAsyncComponent(() => import('@/components/forms/inputs/SelectInput.vue'))
const TextInput = defineAsyncComponent(() => import('@/components/forms/inputs/TextInput.vue'))
/**
 * -----------------------------------------
 *	Composable
 * -----------------------------------------
 */
const $app = useAppStore()
const $emit = defineEmits<Emit>()
const $shop = useShopStore()
const $storage = useStorage<DeliveryDetails>('CheckoutForm')
/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */

const cart = computed(() => $shop.cart)

const selectedLocality = computed<GeoLocation | undefined>(() =>
  localities.value.find((l) => l.id == form.value.delivery_details.location_id)
)

const form = ref<ShopOrderCreate>({
  delivery_details: {
    address: '',
    contact: '',
    location_id: 0,
    name: '',
    coords: undefined
  },
  order_offers: [],
  currency: 'CUP'
})

const isValid = computed(() => {
  return (
    form.value.delivery_details.address &&
    form.value.delivery_details.contact &&
    form.value.delivery_details.location_id > 0 &&
    form.value.delivery_details.name
  )
})

const loading = computed(() => $app.loading)

const localities = computed<GeoLocation[]>(() => [
  {
    id: 1,
    name: 'Palmira',
    delivery_price: 50
  }
])

const subTotal = computed(() => {
  let val = 0
  cart.value.forEach((offerCart) => {
    const offerPrice = offerCart.offer.discount_price
      ? offerCart.offer.discount_price
      : offerCart.offer.sell_price
    val += offerCart.qty * offerPrice
  })
  return val
})
/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */

async function onSubmit() {
  console.log({ form: form.value })
  $storage.set(form.value.delivery_details)
}

onBeforeMount(() => {
  const dataSaved = $storage.get()
  if (dataSaved) {
    form.value.delivery_details = dataSaved
  }
})
</script>

<template>
  <form @submit.prevent="onSubmit" class="bg-white p-4 shadow-md">
    <h3 class="text-center text-lg font-semibold">Datos del Destinatario</h3>
    <div class="mt-4 space-y-2">
      <!-- Location -->
      <SelectInput
        v-model="form.delivery_details.location_id"
        id="location"
        label="Localidad"
        :options="
          localities.map((l) => ({
            label: `${l.name} (${l.delivery_price ? toCurrency(l.delivery_price) : 'Gratis'})`,
            value: l.id
          }))
        "
        required
      />
      <!--/ Location -->

      <!-- Name -->
      <TextInput
        v-model="form.delivery_details.name"
        id="name"
        label="Nombre de Destinatario"
        placeholder="Nombre y Apellidos"
        type="text"
        required
      />
      <!-- / Name -->

      <!-- Contact -->
      <TextInput
        v-model="form.delivery_details.contact"
        id="phone"
        label="Teléfono"
        placeholder="Teléfono de contacto"
        type="tel"
        required
      />
      <!-- / Contact -->

      <!-- Address -->
      <TextInput
        v-model="form.delivery_details.address"
        id="address"
        label="Dirección de entrega"
        type="textarea"
        required
      />
      <!-- Address -->
    </div>

    <!-- Resumen -->
    <div class="mt-2 rounded-lg border border-gray-200 p-2" v-if="isValid">
      <h4 class="text-center text-lg">Resumen</h4>
      <ul class="mt-2 list-none space-y-2">
        <li class="flex justify-between gap-2">
          Precio de Productos:
          <span class="font-semibold">{{ toCurrency(subTotal) }}</span>
        </li>
        <li class="flex justify-between gap-2">
          Precio de Envío:
          <span class="font-semibold">{{ toCurrency(selectedLocality?.delivery_price ?? 0) }}</span>
        </li>
        <li class="flex justify-between gap-2">
          Total:
          <span class="font-semibold">{{
            toCurrency(subTotal + (selectedLocality?.delivery_price ?? 0))
          }}</span>
        </li>
      </ul>

      <p class="mt-2 bg-gray-100 p-2 text-justify">
        Enviar a <b>{{ form.delivery_details.name }}</b> en la dirección
        <b>{{ form.delivery_details.address }}, {{ selectedLocality?.name }}</b
        >. Contactar al <b>{{ form.delivery_details.contact }}</b>
      </p>
    </div>
    <!-- / Resumen -->

    <!-- Buttons -->
    <div class="mt-4 flex gap-2">
      <button
        @click="() => $emit('cancel')"
        type="reset"
        class="rounded-full border border-primary-500 px-2.5 py-2 text-primary-500"
      >
        Regresar
      </button>
      <button
        type="submit"
        :disabled="!isValid"
        class="flex-1 rounded-full bg-primary-500 px-2.5 py-2 text-white"
      >
        Completar
      </button>
    </div>
    <!-- / Buttons -->
  </form>
</template>
