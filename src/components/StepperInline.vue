<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

/**
 -------------------------------------------
 *	Components
 -------------------------------------------
 */

const CheckIcon = defineAsyncComponent(() => import('@/components/icons/CheckIcon.vue'))

/**
 -------------------------------------------
 *	Data
 -------------------------------------------
 */

interface StepperInlineProps {
  labels: Array<string>
  modelValue: number
}

interface StepperInlineEmit {
  (e: 'update:modelValue', v: number): void
}

const $props = defineProps<StepperInlineProps>()
const $emit = defineEmits<StepperInlineEmit>()

/**
 -------------------------------------------
 *	Methods
 -------------------------------------------
 */

function onClick(index: number) {
  if (index < $props.modelValue) $emit('update:modelValue', index)
}
</script>

<template>
  <ol class="flex w-full items-center justify-between">
    <li
      v-for="(label, index) in labels"
      :key="`stepper-item-${index}`"
      class="flex w-full flex-col items-center"
    >
      <div
        class="flex h-8 w-8 items-center justify-center rounded-full text-white"
        :class="[
          index === modelValue ? 'bg-primary' : index < modelValue ? 'bg-green-400' : 'bg-gray-800'
        ]"
      >
        <CheckIcon v-if="index < modelValue" class="h-4 w-4" />
        <template v-else>
          {{ index + 1 }}
        </template>
      </div>
      <div class="text-sm" :class="[index <= modelValue ? 'text-gray-800' : 'text-gray-500']">
        {{ label }}
      </div>
    </li>
  </ol>
</template>
