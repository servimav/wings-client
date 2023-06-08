<script lang="ts" setup>
import type { IconSVG } from '@/helpers/icon'
const props = defineProps<IconSVG>()
</script>
<template>
  <svg v-bind="svg">
    <template v-if="Array.isArray(paths)">
      <path v-for="(path, index) in paths" :key="`icon-path-${index}`" v-bind="path" />
    </template>
    <path v-else v-bind="paths" />
  </svg>
</template>
