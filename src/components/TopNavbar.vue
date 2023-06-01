<script lang="ts" setup>
import { ROUTES } from '@/router/names'
import Icon from '@/components/Icon.vue'
import { magnifyingGlass } from '@/helpers/icon'
</script>
<template>
  <nav class="bg-white border-gray-200">
    <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl py-1 px-3">
      <RouterLink
        :to="{ name: ROUTES.HOME }"
        class="py-1 px-2 text-lg font-medium text-gray-900 hover:text-blue-600"
      >
        Wings</RouterLink
      >

      <div class="flex items-center">
        <Icon
          v-bind="magnifyingGlass"
          class="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700"
        />
      </div>
    </div>
  </nav>
</template>
