import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ShopCategory, ShopOffer, ShopOfferFilter } from '@servimav/wings-services'
import { useServices } from '@/services'
import type { Offer } from '@/types'

const STORE_NAME = 'useShopStore'
const $service = useServices()
export const useShopStore = defineStore(STORE_NAME, () => {
  // store all categories
  const categories = ref<ShopCategory[]>([])
  // home offers
  const homeOffers = ref<Offer[]>([])

  const filterOffers = ref<ShopOffer[]>([])

  /**
   * -----------------------------------------
   *	Actions
   * -----------------------------------------
   */

  /**
   * searchOffers
   */
  async function getFilterOffers(filter: ShopOfferFilter) {
    const resp = (await $service.shop.offer.filter(filter)).data

    filterOffers.value = resp.data
  }

  return {
    categories,
    homeOffers,
    filterOffers,
    // Methods
    getFilterOffers
  }
})

export interface Search {
  title?: string
  offers?: ShopOffer[]
  filter?: string
}
