<script setup lang="ts">
interface Prop {
  repeat: number
}

defineProps<Prop>()
</script>

<template>
  <div
    role="status"
    class="max-w-md animate-pulse space-y-4 divide-y divide-gray-200 rounded border border-gray-200 p-4 shadow dark:divide-gray-700 dark:border-gray-700 md:p-6"
  >
    <div class="flex items-center justify-between" v-for="i in repeat" :key="`skeleton-${i}`">
      <div>
        <div class="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div class="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div class="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
    </div>
    <span class="sr-only">Loading...</span>
  </div>
</template>
