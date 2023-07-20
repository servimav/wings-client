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
  content: string[]
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
  <main class="container h-full min-h-screen w-full p-2 pb-[4.5rem] pt-16">
    <!-- Main Content -->
    <div v-if="helpList.length" class="px-2">
      <div id="accordion-collapse" data-accordion="collapse" class="space-y-2">
        <div v-for="(help, index) in helpList" :key="`accordion-collapse-${index}`">
          <!-- Title -->
          <h2 :id="`accordion-collapse-heading-${index}`">
            <button
              type="button"
              class="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-5 text-left text-gray-500 aria-expanded:rounded-b-none aria-expanded:border-b-0 aria-expanded:border-gray-500 aria-expanded:bg-white aria-expanded:text-gray-800"
              :data-accordion-target="`#accordion-collapse-body-${index}`"
              :aria-controls="`accordion-collapse-body-${index}`"
            >
              <div>{{ `${index + 1}. ` }}{{ help.title }}</div>
              <ChevronUp data-accordion-icon class="h-5 w-5 shrink-0" aria-hidden="true" />
            </button>
          </h2>
          <!-- / Title  -->

          <!-- Body -->
          <div
            :id="`accordion-collapse-body-${index}`"
            class="hidden"
            :aria-labelledby="`accordion-collapse-heading-${index}`"
          >
            <div
              class="space-y-2 rounded-b-xl border-x border-b border-gray-500 bg-white px-5 pb-5"
            >
              <p
                v-for="(paragraph, innerIndex) in help.content"
                :key="`accordion-collapse-body-${innerIndex}`"
                class="text-gray-500"
              >
                {{ paragraph }}
              </p>
            </div>
          </div>
          <!-- / Body -->
        </div>
      </div>
    </div>
    <!-- / Main Content  -->

    <!-- Skeleton -->
    <div v-else role="status" class="max-w-md animate-pulse space-y-4 px-2">
      <div
        v-for="index in 4"
        :key="`skeleton-help-${index}`"
        class="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow"
      >
        <div>
          <div class="mb-2.5 h-3 w-32 rounded-full bg-gray-300"></div>
          <div class="h-3 w-14 rounded-full bg-gray-200"></div>
        </div>
        <div class="h-3 w-3 rounded-full bg-gray-300"></div>
      </div>

      <span class="sr-only">Loading...</span>
    </div>
    <!-- / Skeleton -->
  </main>
</template>
