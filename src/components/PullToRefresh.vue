<script setup lang="ts">
import { ref, computed, defineAsyncComponent, onMounted, onUnmounted } from 'vue'

/**
 -------------------------------------------
 *	Types
 -------------------------------------------
 */

interface Prop {
  onPull: (call: CallableFunction) => Promise<void>
}

const $props = defineProps<Prop>()

/**
 -------------------------------------------
 *	Components
 -------------------------------------------
 */

const ArrowPath = defineAsyncComponent(() => import('@/components/icons/ArrowPath.vue'))

/**
 -------------------------------------------
 *	Lifecycle
 -------------------------------------------
 */

onMounted(() => {
  window.addEventListener('touchstart', pullStart)
  window.addEventListener('touchmove', pull)
  window.addEventListener('touchend', endPull)
})

onUnmounted(() => {
  window.removeEventListener('touchstart', pullStart)
  window.removeEventListener('touchmove', pull)
  window.removeEventListener('touchend', endPull)
})

/**
 -------------------------------------------
*	Methods
-------------------------------------------
*/

/**
 * pullStart runs in first touch gesture
 */
function pullStart($event: TouchEvent) {
  if (state.value != 'loading') {
    if (scrollY == 0) {
      startPoint.value = $event.targetTouches[0].screenY
    } else {
      done()
    }
  }
}

/**
 *  pull runs in drag gesture
 */
function pull($event: TouchEvent) {
  if (state.value != 'loading') {
    if (scrollY == 0 && startPoint.value) {
      const { screenY } = $event.targetTouches[0]
      pullChange.value = screenY - startPoint.value
      if (state.value != 'pulldown') {
        state.value = 'pulldown'
      }
    } else {
      done()
    }
  }
}

/**
 * endPull runs at the end of the touch gesture
 */
async function endPull() {
  if (scrollY == 0) {
    if (pullChange.value / SLOWNESS - NEGATIVE_TOP > MAX_PULL) {
      state.value = 'loading'
      await $props.onPull(done)
    } else {
      done()
    }
  }
}

function done() {
  state.value = 'initial'
  startPoint.value = null
  pullChange.value = 0
}

/**
 -------------------------------------------
 *	Data
 -------------------------------------------
 */

const startPoint = ref<number | null>(null)
const pullChange = ref(0)
const state = ref<'initial' | 'pulldown' | 'loading'>('initial')

/**
 * Constant parameters
 */
const NEGATIVE_TOP = 50
const SLOWNESS = 3
const MAX_PULL = 50

const containerStyle = computed(() => {
  switch (state.value) {
    case 'initial':
      return { top: `${-NEGATIVE_TOP}px` }
    case 'pulldown':
      return { top: `${Math.min(pullChange.value / SLOWNESS - NEGATIVE_TOP, MAX_PULL)}px` }
    case 'loading':
      return { top: `${MAX_PULL}px` }
    default:
      return {}
  }
})

const svgStyle = computed(() => {
  switch (state.value) {
    case 'initial':
      return { transform: `rotate(${pullChange.value}deg)` }
    case 'pulldown':
      return { transform: `rotate(${pullChange.value}deg)` }
    case 'loading':
      return { animation: 'spin 2s linear infinite' }
    default:
      return {}
  }
})
</script>

<template>
  <div
    class="containier fixed z-40 w-full"
    :class="{ 'transition-[top] duration-300': state === 'initial' }"
    :style="containerStyle"
  >
    <div class="mx-auto w-fit rounded-full bg-white p-2 shadow">
      <ArrowPath
        class="h-7 w-7 text-gray-900"
        :class="{ 'animate-spin': state === 'loading' }"
        :style="svgStyle"
      />
    </div>
  </div>
</template>
