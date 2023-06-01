<script lang="ts" setup>
import type { IconSVG } from '@/helpers/icon'
const props = defineProps<IconSVG>()
</script>
<template>
  <svg v-bind="svg">
    <path v-bind="path" />
  </svg>
</template>
