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
    class="fixed top-0 z-30 flex h-screen w-screen items-center justify-center overflow-auto p-4"
  >
    <div class="absolute top-0 z-20 h-screen w-screen bg-black opacity-80"></div>

    <div class="z-40 rounded-lg bg-white p-2">
      <div class="rounded-lg border border-gray-200 p-2">
        <h1 class="text-center text-xl text-gray-900">Pedidos en Espera</h1>
        <p class="mt-2 text-gray-900">Estamos optimizando nuestros servicios.</p>
        <p class="mt-2 text-gray-900">
          Comenzaremos a procesar los pedidos dentro de <b>{{ diffDays }} días</b>
        </p>
      </div>
    </div>
  </div>
</template>
