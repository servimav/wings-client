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
  <label v-if="label" :for="id" class="mb-2 block font-medium text-gray-800">{{ label }}</label>
  <select
    :id="id"
    :value="modelValue"
    :name="id"
    :required="required"
    class="input block w-full p-2.5"
    @change="onChange"
  >
    <option v-for="(option, key) in options" :key="`option-${key}`" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>
