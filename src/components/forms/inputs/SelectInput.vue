<script setup lang="ts">
interface SelectInputProps {
  modelValue?: string | number
  required?: boolean
  id: string
  label?: string
  options: Array<{ label: string; value: string | number }>
}

defineProps<SelectInputProps>()

const $emit = defineEmits<{ (e: 'update:modelValue', value: string | number): void }>()

function onChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  $emit('update:modelValue', value)
}
</script>

<template>
  <label v-if="label" :for="id" class="mb-2 block text-sm font-medium text-gray-800">{{
    label
  }}</label>
  <select
    :id="id"
    :value="modelValue"
    :name="id"
    :required="required"
    class="w-full rounded-lg bg-white border border-gray-200 p-2 text-sm text-gray-600 outline-none placeholder:text-gray-500 focus:ring-1 focus:ring-gray-500"
    @change="onChange"
  >
    <option v-for="(option, key) in options" :key="`option-${key}`" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>
