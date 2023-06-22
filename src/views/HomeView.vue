<script setup lang="ts">
import { ref } from 'vue'
import OfferSlider from '@/components/sliders/OfferSlider.vue'
import CategorySlider from '@/components/sliders/CategorySlider.vue'
import OfferAdvancedWidget from '@/components/widgets/OfferAdvancedWidget.vue'
import OfferWidget from '@/components/widgets/OfferWidget.vue'
import { CATEGORIES, OFFERS } from '@/helpers/defaults'

const category = ref(CATEGORIES[2])
</script>

<template>
  <main class="px-2 pt-20 pb-16 w-full container">
    <div class="px-2 mb-4">
      <OfferSlider :offers="[...OFFERS, ...OFFERS]" />
    </div>
    <div class="px-2 mb-2">
      <CategorySlider :categories="CATEGORIES" v-model:category-active="category" class="mb-2" />
      <div class="grid grid-cols-2 gap-2">
        <OfferWidget
          v-for="(offer, index) in [...OFFERS, ...OFFERS]"
          :key="`home-view-offer-grid-example-${index}`"
          v-bind="offer"
        />
      </div>
    </div>
    <div class="p-2 mb-2">
      <div class="flex-col space-y-2">
        <OfferAdvancedWidget
          v-for="(offer, index) in [...OFFERS, ...OFFERS]"
          :key="`home-view-offer-grid-example-${index}`"
          v-bind="offer"
        />
      </div>
    </div>
  </main>
</template>
