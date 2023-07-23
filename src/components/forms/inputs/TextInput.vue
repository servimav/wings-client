<script setup lang="ts">
import { computed } from 'vue'
/**
 -------------------------------------------
 *	Data
 -------------------------------------------
 */

export interface TextInputProps {
  modelValue?: string | number
  type: 'text' | 'number' | 'email' | 'tel' | 'password' | 'textarea' | 'currency' | 'search'
  required?: boolean
  readonly?: boolean
  id: string
  label?: string
  placeholder?: string
  rows?: number
  min?: number
  max?: number
  step?: number
  noAutocomplete?: boolean
}

const $props = defineProps<TextInputProps>()
const $emit = defineEmits<{ (e: 'update:modelValue', value: string | number): void }>()
const realType = computed(() => ($props.type === 'currency' ? 'number' : $props.type))

/**
 -------------------------------------------
 *	Methods
 -------------------------------------------
 */

/**
 * validate
 * @param value
 */
function validate(value: string | number) {
  return true
}

/**
 * onChange
 * @param event
 */
function onChange(event: Event) {
  let value = (event.target as HTMLInputElement).value
  if ($props.type === 'currency') {
    value = Number(value).toFixed(2)
  }
  if (validate(value)) {
    $emit('update:modelValue', value)
  }
}
</script>

<template>
  <div>
    <label v-if="label" :for="id" class="mb-2 block font-medium text-gray-800">{{ label }}</label>

    <textarea
      v-if="type === 'textarea'"
      :value="modelValue"
      :name="id"
      :id="id"
      :placeholder="placeholder"
      :required="required"
      :readonly="readonly"
      :rows="rows"
      autocomplete="on"
      class="input block w-full p-2.5"
      @change="onChange"
    ></textarea>

    <input
      v-else
      :value="modelValue"
      :type="realType"
      :name="id"
      :id="id"
      :placeholder="placeholder"
      :required="required"
      :readonly="readonly"
      :min="min"
      :max="max"
      :step="type === 'currency' ? '0.01' : step"
      autocomplete="on"
      class="input block w-full p-2.5"
      @change="onChange"
    />
  </div>
</template>
