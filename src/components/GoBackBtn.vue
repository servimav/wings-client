<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import { goBack } from '@/helpers'
/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */
const ArrowLeft = defineAsyncComponent(() => import('@/components/icons/ArrowLeft.vue'))
</script>

<template>
  <button
    type="button"
    class="rounded-full bg-white p-2 shadow-lg focus:outline-none"
    @click="goBack"
  >
    <ArrowLeft class="h-5 w-5 text-gray-900" />
    <span class="sr-only">Arrow left icon</span>
  </button>
</template>
