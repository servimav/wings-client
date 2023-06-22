<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */
const ArrowLeft = defineAsyncComponent(() => import('@/components/icons/ArrowLeft.vue'))
const router = useRouter()
</script>

<template>
  <button
    type="button"
    class="fixed z-20 top-5 left-5 rounded-full p-1.5 text-gray-900 bg-white shadow-lg focus:outline-none"
    @click="router.back()"
  >
    <ArrowLeft class="h-5 w-5 text-gray-900" />

    <span class="sr-only">Arrow left icon</span>
  </button>
</template>
