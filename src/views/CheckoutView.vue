<script setup lang="ts">
import { ref, defineAsyncComponent, onBeforeMount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import type {
  DeliveryDetails,
  GeoLocation,
  ShopOrder,
  ShopOrderCreate
} from '@servimav/wings-services'
import { scrollTop, toCurrency, useStorage } from '@/helpers'
import { ROUTES } from '@/router'
import { useServices } from '@/services'
import { useAppStore, useShopStore, useUserStore } from '@/stores'

/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */

const CaretOfferWidget = defineAsyncComponent(
  () => import('@/components/widgets/CaretOfferWidget.vue')
)
const CheckIcon = defineAsyncComponent(() => import('@/components/icons/CheckIcon.vue'))
const LoadingSpinner = defineAsyncComponent(() => import('@/components/widgets/LoadingSpinner.vue'))
const StepperInline = defineAsyncComponent(() => import('@/components/StepperInline.vue'))
const SelectInput = defineAsyncComponent(() => import('@/components/forms/inputs/SelectInput.vue'))
const TextInput = defineAsyncComponent(() => import('@/components/forms/inputs/TextInput.vue'))
const ChevronRight = defineAsyncComponent(() => import('@/components/icons/ChevronRight.vue'))

/**
 -------------------------------------------
 *	Composables
 -------------------------------------------
 */

const $app = useAppStore()
const $router = useRouter()
const $service = useServices()
const $shop = useShopStore()
const $storage = useStorage<DeliveryDetails>('deliveryDetails')
const $user = useUserStore()

/**
 -------------------------------------------
 *	Data
 -------------------------------------------
 */

const cart = computed(() => $shop.cart)

const deliveryPrice = computed(() =>
  locationSelected.value?.delivery_price && locationSelected.value.delivery_price > 0
    ? locationSelected.value.delivery_price
    : 0
)

const form = ref<ShopOrderCreate>({
  delivery_details: {
    address: '',
    contact: '',
    location_id: 1,
    name: '',
    coords: undefined
  },
  items: [],
  message: '',
  currency: 'CUP',
  payment_type: 'TRANSFER_TOTAL'
})

const loading = computed(() => $app.loading)

const locations = ref<GeoLocation[]>([])

const locationSelected = computed(() =>
  form.value.delivery_details.location_id
    ? locations.value.find((l) => l.id === form.value.delivery_details.location_id)
    : undefined
)
const stepActive = ref(0)

const order = ref<ShopOrder>()

const STEP_LABELS: Array<string> = ['Destinatario', 'Revisión', 'Pago']

const subtotalItems = computed(() => {
  let total = 0
  cart.value.forEach((item) => {
    total += item.qty * item.price
  })
  return total
})

const total = computed(() => Number(subtotalItems.value) + Number(deliveryPrice.value))

const user = computed(() => $user.user)

/**
 -------------------------------------------
 *	Methods
 -------------------------------------------
 */

/**
 * onSubmit
 */
async function onSubmit() {
  $app.toggleLoading(true)
  try {
    const { data } = await $service.shop.order.create(form.value)
    order.value = data
    // remove cart
    $shop.cart = []
    $shop.saveCartOnStorage()
    $app.success('Pedido creado correctamente')
  } catch (error) {
    $app.axiosError(error)
  }
  $app.toggleLoading(false)
}

/**
 * onNext
 */
async function onNext() {
  if (loading.value) return

  switch (stepActive.value) {
    case 0:
      // Validate
      if (
        !form.value.delivery_details.address ||
        !form.value.delivery_details.contact ||
        form.value.delivery_details.location_id < 1
      )
        $app.notify({
          type: 'warning',
          message: 'Verifique los datos'
        })
      else {
        $storage.set(form.value.delivery_details)
        stepActive.value++
      }
      break
    case 1:
      // revision
      stepActive.value++
      break
    case 2:
      // Submit
      stepActive.value++
      await onSubmit()
      break
    default:
      $app.notify({
        message: 'Ha ocurrido un error',
        type: 'warning'
      })
  }
  scrollTop()
}

/**
 * getSavedDeliveryDetails
 */
function getSavedDeliveryDetails() {
  const data = $storage.get()
  if (data) {
    form.value.delivery_details = data
    if (locationSelected.value && locationSelected.value.description) {
      form.value.delivery_details.address = `${locationSelected.value.description}, ${locationSelected.value.name}`
    }
  } else if (user.value) {
    form.value.delivery_details = {
      address: '',
      contact: user.value.phone,
      location_id: 1,
      name: user.value.name,
      coords: undefined
    }
  }
}

/**
 * loadLocations
 */
async function loadLocations() {
  try {
    const resp = await $service.geoLocation.list()
    locations.value = resp.data.data
  } catch (error) {
    $app.axiosError(error, 'No se pudo cargar las localizaciones')
  }
}

/**
 * onSetLocation
 * @param value
 */
function onSetLocation(value: string | number) {
  form.value.delivery_details.location_id = Number(value)
  if (locationSelected.value && locationSelected.value.description) {
    form.value.delivery_details.address = `${locationSelected.value.description}, ${locationSelected.value.name}`
  }
}

/**
 -------------------------------------------
 *	Lifecycle
 -------------------------------------------
 */

onBeforeMount(async () => {
  // Setup title
  useHead({
    title: 'Compras y Envíos | Wings'
  })
  if (!cart.value.length) $router.push({ name: ROUTES.HOME })
  form.value.items = cart.value
  getSavedDeliveryDetails()
  loadLocations()
})
</script>

<template>
  <main class="container relative h-full min-h-screen w-full">
    <div class="fixed left-0 top-12 w-full bg-white pb-2 pt-5">
      <StepperInline :labels="STEP_LABELS" v-model="stepActive" />
    </div>

    <div class="pb-20 pt-36">
      <form class="text-slate-800 select-none">
        <!-- Destinatary (Step 1) -->
        <section class="mx-4 space-y-4 rounded-xl bg-white p-4" v-show="stepActive === 0">
          <p class="text-gray-500">
            Rellene el siguiente formulario con la información de la persona que recogerá el pedido
            y el lugar donde se lo enviaremos.
          </p>
          <div>
            <SelectInput
              id="location"
              :model-value="form.delivery_details.location_id"
              @update:model-value="onSetLocation"
              :options="
                locations.map((l) => ({
                  label: `${l.name} ${
                    l.delivery_price && l.delivery_price > 0
                      ? `(+${toCurrency(l.delivery_price)})`
                      : '(Gratis)'
                  }`,
                  value: l.id
                }))
              "
              label="Lugar de Recogida"
              required
            />
            <p class="mt-2 text-gray-500">
              {{ form.delivery_details.address }}
            </p>
          </div>

          <div>
            <TextInput
              v-model="form.delivery_details.name"
              id="name"
              type="text"
              label="Nombre Completo"
              placeholder="Nombres y Apellidos"
              required
            />
          </div>

          <div>
            <TextInput
              v-model="form.delivery_details.contact"
              id="phone"
              type="tel"
              label="Número de teléfono"
              placeholder="555555"
              required
            />
          </div>

          <!-- Address Input  -->
          <!--
          <div>
            <TextInput v-model="form.delivery_details.address" id="address" type="textarea" :rows="4" label="Dirección"
              placeholder="Calle Flores #45" required readonly />
          </div
           -->
        </section>
        <!-- Destinatary (Step 1) -->

        <!-- Revision (Step 2) -->
        <section class="mx-4 space-y-2 rounded-md" v-show="stepActive === 1">
          <!-- Cart Items -->
          <h3 class="text-center font-semibold">Productos Seleccionados</h3>

          <div class="space-y-2">
            <CaretOfferWidget
              v-for="(item, itemKey) in cart"
              :key="`item-cart-${itemKey}-${item.id}`"
              :item="item"
              readonly
              small
            />
          </div>

          <RouterLink
            :to="{ name: ROUTES.CARET }"
            class="btn btn-sm mx-auto flex w-full items-center justify-between rounded-xl border border-gray-100 bg-white py-2"
          >
            <span></span>
            <span>Editar Productos</span>
            <ChevronRight class="h-5 w-5 text-gray-800" />
          </RouterLink>
          <!-- / Cart Items -->

          <!-- Cart Prices -->
          <div class="mt-2 rounded-xl bg-white p-4">
            <h3 class="text-center text-lg font-semibold">Listado de Precios</h3>
            <ul class="mt-2 list-none space-y-2">
              <li>Total de Ofertas: {{ toCurrency(subtotalItems) }}</li>
              <li>Envío: {{ deliveryPrice > 0 ? toCurrency(deliveryPrice) : 'Gratis' }}</li>
              <li class="border-slate-400 border"></li>
              <li>Total: {{ toCurrency(total) }}</li>
            </ul>
          </div>
          <!-- / Cart Prices -->

          <div class="mt-2 rounded-xl bg-white p-4">
            <h3 class="text-center text-lg font-semibold">Detalles de Destinatario</h3>

            <ul class="mt-2 list-none space-y-2">
              <li>Nombre: {{ form.delivery_details.name }}</li>
              <li>Contacto: {{ form.delivery_details.contact }}</li>
              <li>Dirección: {{ form.delivery_details.address }}</li>
            </ul>
          </div>
        </section>
        <!-- / Revision (Step 2) -->

        <!-- Payment (Step 3) -->
        <section class="mx-4" v-show="stepActive === 2">
          <div class="rounded-md bg-white p-4">
            <h3 class="text-center text-lg font-semibold">Seleccione la forma de pago</h3>

            <div class="mt-4 space-y-4">
              <!-- Payment Total -->
              <div
                @click="form.payment_type = 'TRANSFER_TOTAL'"
                class="flex gap-2 rounded-xl p-4"
                :class="
                  form.payment_type === 'TRANSFER_TOTAL'
                    ? 'border border-gray-500'
                    : 'text-gray-500'
                "
              >
                <CheckIcon class="h-4 w-4" v-if="form.payment_type === 'TRANSFER_TOTAL'" />
                <div class="flex-1 space-y-2">
                  Pago Total<br />
                  <p>Pago por transferencia de {{ toCurrency(total) }}</p>
                  <p class="font-semibold">Los datos del pago se lo enviaremos a su WhatsApp</p>
                </div>
              </div>
              <!-- / Payment Total -->

              <!-- Payment Partial -->
              <div
                @click="form.payment_type = 'TRANSFER_PARTIAL'"
                class="flex gap-2 rounded-xl p-4"
                :class="
                  form.payment_type === 'TRANSFER_PARTIAL'
                    ? 'border border-gray-500 '
                    : 'text-gray-500'
                "
              >
                <CheckIcon class="h-4 w-4" v-if="form.payment_type === 'TRANSFER_PARTIAL'" />
                <div class="flex-1 space-y-2">
                  <b>Pago Parcial</b>
                  <p>Primero transfiere la mitad para asegurar su pedido</p>
                  <p>Luego tranfiere la otra mitad cuando le entreguemos el pedido</p>
                  <p class="font-semibold">Los datos del pago se lo enviaremos a su WhatsApp</p>
                </div>
              </div>
              <!-- / Payment Partial -->
            </div>
          </div>
        </section>
        <!-- / Payment (Step 3)  -->

        <!-- Final Step -->
        <section class="text-slate-900 mx-4" v-show="stepActive === 3">
          <div class="rounded-md bg-white p-4">
            <div v-if="loading">
              <h3 class="text-center font-semibold">Guardando Pedido</h3>

              <div class="mt-4 flex w-full justify-center">
                <LoadingSpinner class="h-10 w-10" />
              </div>
            </div>

            <div v-else-if="order" class="bg-white">
              <h3 class="text-center text-lg font-semibold">Pedido Creado</h3>
              <div class="mt-4 flex w-full justify-center">
                <div class="flex h-10 w-10 items-center rounded-full border border-green-500 p-2">
                  <CheckIcon class="text-green-500" />
                </div>
              </div>
              <div class="mt-2 text-center font-semibold">
                <p>Su pedido ha sido guardado correctamente</p>
              </div>

              <p class="mt-4 border p-2">
                Le enviaremos por WhatsApp los detalles del Pago para proceder con el Envío
              </p>

              <RouterLink :to="{ name: ROUTES.ORDER, params: { orderId: order.id } }">
                <div class="text-md btn btn-md btn-primary mt-2 w-full text-center font-semibold">
                  Revisar Pedido
                </div>
              </RouterLink>
            </div>
          </div>
        </section>
        <!-- / Final Step  -->

        <div class="fixed bottom-0 z-10 w-full border-t border-gray-100 bg-white p-2">
          <div class="flex items-center justify-center space-x-2">
            <button
              type="button"
              @click="stepActive--"
              v-if="stepActive > 0 && stepActive < 3"
              class="btn btn-lg btn-secondary"
            >
              Atrás
            </button>
            <button
              type="button"
              @click="onNext"
              v-if="stepActive < 3"
              class="btn btn-lg btn-primary w-full"
            >
              {{ stepActive === 2 ? 'Finalizar' : 'Continuar' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </main>
</template>
