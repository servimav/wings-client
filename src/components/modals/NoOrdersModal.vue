<script setup lang="ts">
const $emit = defineEmits<{ (e: 'close'): void }>()

const releaseDate = new Date('2023-7-20')
const today = new Date()

// Calculate the time difference between the two dates in milliseconds
const timeDiff = releaseDate.getTime() - today.getTime()

// Calculate the number of days between the two dates
const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
</script>

<template>
  <div
    @click="() => $emit('close')"
    class="h-screen w-screen z-30 overflow-auto fixed top-0 flex items-center p-4 justify-center"
  >
    <div class="absolute top-0 w-screen h-screen z-20 bg-black opacity-80"></div>

    <div class="bg-white p-2 z-40 rounded-lg">
      <div class="p-2 border border-gray-200 rounded-lg">
        <h1 class="text-xl text-center text-gray-900">Pedidos en Espera</h1>
        <p class="text-gray-900 mt-2">Estamos optimizando nuestros servicios.</p>
        <p class="text-gray-900 mt-2">
          Comenzaremos a procesar los pedidos dentro de <b>{{ diffDays }} días</b>
        </p>
      </div>
    </div>
  </div>
</template>
