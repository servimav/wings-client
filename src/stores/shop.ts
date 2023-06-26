import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ShopCategory, ShopOffer } from '@servimav/wings-services'
import type { Offer } from '@/types'

const STORE_NAME = 'useShopStore'

export const useShopStore = defineStore(STORE_NAME, () => {
  // store all categories
  const categories = ref<ShopCategory[]>([])
  // home offers
  const homeOffers = ref<Offer[]>([])
  const homeOffersCurrentPage = ref<number>()

  return {
    categories,
    homeOffers,
    homeOffersCurrentPage
  }
})

export interface Search {
  title?: string
  offers?: ShopOffer[]
  filter?: string
}
