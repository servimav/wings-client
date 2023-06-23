import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Offer } from '@/types'
import type { ShopCategory } from '@servimav/wings-services'

const STORE_NAME = 'useShopStore'

export const useShopStore = defineStore(STORE_NAME, () => {
  const categories = ref<ShopCategory[]>([])
  const offers = ref<Offer[]>([])

  return {
    categories,
    offers
  }
})
