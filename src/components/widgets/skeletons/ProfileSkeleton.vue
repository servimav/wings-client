<template>
  <div
    role="status"
    class="relative max-w-sm animate-pulse rounded-lg border border-gray-200 bg-white p-4 shadow"
  >
    <!-- User Icon -->
    <svg
      class="absolute -top-6 left-1/2 mx-auto h-12 w-12 -translate-x-1/2 text-gray-200"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"
      />
    </svg>
    <!-- / User Icon -->

    <div class="mx-auto mb-5 mt-5 h-4 w-48 rounded-full bg-gray-200"></div>
    <div
      v-for="index in 4"
      :key="`profile-skeleton-${index}`"
      class="mb-3 flex items-center justify-between"
    >
      <div class="h-3 w-32 rounded-full bg-gray-200"></div>
      <div class="h-3 w-32 rounded-full bg-gray-200"></div>
    </div>

    <span class="sr-only">Loading...</span>
  </div>
</template>
