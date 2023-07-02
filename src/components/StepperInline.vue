<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

/**
 *******************************************
 *	Components
 *******************************************
 */
const CheckIcon = defineAsyncComponent(() => import('@/components/icons/CheckIcon.vue'))

/**
 *******************************************
 *	Data
 *******************************************
 */
/**
 * Props
 */
interface StepperInlineProps {
  labels: Array<string>
  active: number
}

defineProps<StepperInlineProps>()
</script>

<template>
  <ol class="flex items-center justify-between w-full">
    <li
      v-for="(label, index) in labels"
      :key="`stepper-item-${index}`"
      class="w-full flex flex-col items-center space-y-1"
    >
      <div
        class="flex items-center justify-center w-8 h-8 text-white rounded-full"
        :class="[
          index === active ? 'bg-gray-800' : index < active ? 'bg-butterfly-blue' : 'bg-gray-500'
        ]"
      >
        <CheckIcon v-if="index < active" class="w-6 h-6 text-butterfly-blue" />
        <template v-else>
          {{ index + 1 }}
        </template>
      </div>
      <div :class="[index <= active ? 'text-gray-800' : 'text-gray-500']">
        {{ label }}
      </div>
    </li>
  </ol>
</template>
