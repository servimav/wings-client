<script lang="ts" setup>
import { ref, defineAsyncComponent, computed } from 'vue'
import type { Offer } from '@/types'
/**
 * -----------------------------------------
 *	Types
 * -----------------------------------------
 */
export interface Emit {
  (e: 'clickOnOffer', offer: Offer): void
}

export interface Props {
  offers: Offer[]
}

/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */
const OfferWidget = defineAsyncComponent(() => import('@/components/widgets/OfferWidget.vue'))
const ChevronLeft = defineAsyncComponent(() => import('@/components/icons/ChevronLeft.vue'))
const ChevronRight = defineAsyncComponent(() => import('@/components/icons/ChevronRight.vue'))

/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */
const $props = defineProps<Props>()
const $emits = defineEmits<Emit>()

/**
 * ------------------------------------------
 *  Data
 * ------------------------------------------
 */
const OFFER_WIDTH = 2 * 176 // class 'w-44' equals to 176 px
const scrollPosition = ref(0)
const container = ref<HTMLDivElement>()

const isScrollToEnd = computed(
  () =>
    container.value &&
    ((scrollPosition.value > 0 &&
      container.value.offsetWidth + scrollPosition.value == container.value.scrollWidth) ||
      $props.offers.length == 1)
)

/**
 * ------------------------------------------
 *  Methods
 * ------------------------------------------
 */
function scrollToLeft() {
  if (container.value && container.value.scrollLeft != 0) {
    container.value.scrollLeft -= OFFER_WIDTH
  }
}

function scrollToRight() {
  if (container.value && !isScrollToEnd.value) {
    container.value.scrollLeft += OFFER_WIDTH
  }
}

function onScroll(event: Event) {
  scrollPosition.value = (event.target as HTMLDivElement).scrollLeft
}
</script>

<template>
  <div class="relative flex items-center">
    <!-- Left button -->
    <button
      v-if="scrollPosition > 0"
      type="button"
      class="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-1 text-gray-900 shadow focus:outline-none"
      @click="scrollToLeft"
    >
      <ChevronLeft class="h-5 w-5 text-gray-900" />

      <span class="sr-only">Arrow left icon</span>
    </button>

    <!-- Right button -->
    <button
      v-if="!isScrollToEnd"
      type="button"
      class="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-1 text-gray-900 shadow focus:outline-none"
      @click="scrollToRight"
    >
      <ChevronRight class="h-5 w-5 text-gray-900" />

      <span class="sr-only">Arrow right icon</span>
    </button>

    <!-- Slider -->
    <div
      ref="container"
      class="no-scrollbar flex items-center space-x-2 overflow-x-scroll scroll-smooth"
      @scroll="onScroll"
    >
      <div
        v-for="(offer, index) in offers"
        :key="`offer-slider-${index}`"
        class="w-44 flex-shrink-0"
      >
        <OfferWidget :offer="offer" @click="() => $emit('clickOnOffer', offer)" />
      </div>
    </div>
  </div>
</template>
