<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { initAccordions } from 'flowbite'
import { useServices } from '@/services'
import { useAppStore } from '@/stores'

/**
 -------------------------------------------
 *	Types
 -------------------------------------------
 */

interface HelpItem {
  title: string
  content: string
}

/**
 -------------------------------------------
 *	Components
 -------------------------------------------
 */

const ChevronUp = defineAsyncComponent(() => import('@/components/icons/ChevronUp.vue'))

/**
 -------------------------------------------
 *	Composables
 -------------------------------------------
 */

const { api } = useServices()
const $app = useAppStore()

/**
 -------------------------------------------
 *	Data
 -------------------------------------------
 */

const helpList = ref<HelpItem[]>([])

/**
 -------------------------------------------
 *	Methods
 -------------------------------------------
 */

/**
 * getHelpList
 */
async function getHelpList() {
  try {
    const resp = (await api.get<HelpItem[]>('/help')).data
    helpList.value = resp
  } catch (error) {
    $app.axiosError(error)
  }
}

/**
 -------------------------------------------
 *	Lifecycle
 -------------------------------------------
 */

onMounted(async () => {
  await getHelpList()
  setTimeout(() => {
    initAccordions()
  }, 1000)
})
</script>

<template>
  <main class="container h-full min-h-screen w-full select-none bg-gray-50 p-2 pb-[4.5rem] pt-16">
    <!-- Main Content -->
    <div v-if="helpList.length" class="px-2">
      <div
        id="accordion-collapse"
        data-accordion="collapse"
        data-active-classes="group-last:rounded-b-none"
        class="bg-white"
      >
        <div v-for="(help, index) in helpList" :key="`accordion-collapse-${index}`" class="group">
          <h2 :id="`accordion-collapse-heading-${index}`">
            <button
              type="button"
              class="flex w-full items-center justify-between border border-b-0 border-gray-200 p-5 text-left font-medium text-gray-500 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 group-first:rounded-t-xl group-last:rounded-b-xl group-last:border-b group-last:aria-expanded:rounded-b-none dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
              :data-accordion-target="`#accordion-collapse-body-${index}`"
              aria-expanded="true"
              :aria-controls="`accordion-collapse-body-${index}`"
            >
              <span>{{ help.title }}</span>
              <ChevronUp
                data-accordion-icon
                class="h-5 w-5 shrink-0 rotate-180"
                aria-hidden="true"
              />
            </button>
          </h2>
          <div
            :id="`accordion-collapse-body-${index}`"
            class="hidden"
            :aria-labelledby="`accordion-collapse-heading-${index}`"
          >
            <div class="border-x border-gray-200 p-5 dark:border-gray-700">
              <p class="text-gray-500 dark:text-gray-400">
                {{ help.content }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- / Main Content  -->

    <!-- Skeleton -->
    <div
      v-else
      role="status"
      class="max-w-md animate-pulse space-y-4 divide-y divide-gray-200 rounded border border-gray-200 bg-white p-4 shadow dark:divide-gray-700 dark:border-gray-700 md:p-6"
    >
      <div
        v-for="index in 4"
        :key="`skeleton-help-${index}`"
        class="flex items-center justify-between pt-4 first:pt-0"
      >
        <div>
          <div class="mb-2.5 h-3 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div class="h-3 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div class="h-3 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
      </div>

      <span class="sr-only">Loading...</span>
    </div>
    <!-- / Skeleton -->
  </main>
</template>
