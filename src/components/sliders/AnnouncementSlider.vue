<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { initCarousels } from 'flowbite'
import type { Announcement } from '@servimav/wings-services'
import { useServices } from '@/services'
import { useAppStore } from '@/stores'
/**
 * ------------------------------------------
 *	Composables
 * ------------------------------------------
 */

defineOptions({
  name: 'AnnouncementSlider'
})
const $app = useAppStore()
const $service = useServices()

/**
 * ------------------------------------------
 *	Data
 * ------------------------------------------
 */

const announcements = ref<Announcement[]>([])

/**
 * ------------------------------------------
 *	Methods
 * ------------------------------------------
 */

/**
 * getAnnouncements
 */
async function getAnnouncements() {
  try {
    const { data } = await $service.announcement.filter()
    announcements.value = data.data
  } catch (error) {
    $app.axiosError(error)
  }
}

onMounted(async () => {
  await getAnnouncements()
  setTimeout(() => {
    initCarousels()
  }, 1000)
})
</script>

<template>
  <div
    id="announcements-carousel"
    class="relative w-full"
    data-carousel="slide"
    v-if="announcements.length"
  >
    <!-- Carousel wrapper -->
    <div class="relative h-56 overflow-hidden rounded-lg md:h-96">
      <!-- Item 1 -->
      <a
        v-for="(ann, annKey) in announcements"
        :key="`ann-${ann.id}-${annKey}`"
        :target="ann.target"
        :href="ann.link"
        class="z-0 hidden duration-700 ease-in-out"
        style="z-index: 0 !important"
        data-carousel-item
      >
        <img
          :src="ann.image"
          :alt="ann.name"
          :title="ann.name"
          style="z-index: 0 !important"
          class="absolute left-1/2 top-1/2 z-0 block w-full -translate-x-1/2 -translate-y-1/2"
        />
      </a>
    </div>

    <!-- Slider indicators -->
    <div class="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 space-x-3">
      <button
        v-for="(ann, annKey) in announcements"
        :key="`ann-indicator-${ann.id}-${annKey}`"
        type="button"
        class="h-3 w-3 rounded-full"
        aria-current="true"
        :aria-label="`Slide ${annKey}`"
        :data-carousel-slide-to="annKey"
      ></button>
    </div>
    <!-- / Slider indicators -->

    <!-- Slider controls -->
    <button
      type="button"
      class="group absolute left-0 top-0 z-10 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
      data-carousel-prev
    >
      <span
        class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70"
      >
        <svg
          class="h-4 w-4 text-white dark:text-gray-800"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 6 10"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 1 1 5l4 4"
          />
        </svg>
        <span class="sr-only">Previous</span>
      </span>
    </button>

    <button
      type="button"
      class="group absolute right-0 top-0 z-10 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
      data-carousel-next
    >
      <span
        class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70"
      >
        <svg
          class="h-4 w-4 text-white dark:text-gray-800"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 6 10"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 9 4-4-4-4"
          />
        </svg>
        <span class="sr-only">Next</span>
      </span>
    </button>
  </div>
</template>
