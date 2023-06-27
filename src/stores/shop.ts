import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ShopCategory, ShopOffer } from '@servimav/wings-services'

const STORE_NAME = 'useShopStore'

export const useShopStore = defineStore(STORE_NAME, () => {
  // store all categories
  const categories = ref<ShopCategory[]>([])

  return {
    categories
  }
})

export interface Search {
  title?: string
  offers?: ShopOffer[]
  filter?: string
}
