import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  type ShopCategory,
  type ShopOffer,
  type OrderItem,
  STOCK_TYPE,
  type Currency
} from '@servimav/wings-services'
import { useServices } from '@/services'
import { useStorage } from '@/helpers'

const STORE_NAME = 'useShopStore'
const $storage = useStorage<OrderItem[]>(STORE_NAME)

export const useShopStore = defineStore(STORE_NAME, () => {
  const $service = useServices()

  // store all categories
  const categories = ref<ShopCategory[]>([])
  // cart
  const cart = ref<OrderItem[]>([])

  const currencies = ref<Currency[]>([])

  // Home offers
  const homeOffers = ref<ShopOffer[]>([])
  const homePagination = ref<number>()

  // Incomming offers
  const incommingOffers = ref<ShopOffer[]>([])
  const incommingPagination = ref<number>()

  /**
   * -----------------------------------------
   *	Methods
   * -----------------------------------------
   */

  /**
   * addCartItem
   * @param item
   * @returns boolean
   */
  function addCartOffer(item: OrderItem): boolean {
    if (!canAddOffer(item)) return false
    // check if exists
    const existsIndex = cart.value.findIndex((c) => c.id === item.id)
    // if exists add qty
    if (existsIndex >= 0) {
      cart.value[existsIndex].qty++
    }
    // Store
    else {
      cart.value.push(item)
    }
    saveCartOnStorage()
    return true
  }

  /**
   * canAddOffer
   * @param item
   * @returns
   */
  function canAddOffer(item: OrderItem): boolean {
    // check if exists
    const existsIndex = cart.value.findIndex((c) => c.id === item.id)
    // if exists add qty
    if (existsIndex >= 0) {
      const stockType = item.offer?.stock_type
      if (stockType === STOCK_TYPE.INFINITY) return true
      else if (stockType === STOCK_TYPE.OUT || stockType === STOCK_TYPE.INCOMMING) return false
      else if (stockType === STOCK_TYPE.LIMITED && item.offer?.stock_qty) {
        const cartQty = cart.value[existsIndex].qty
        return cartQty < item?.offer.stock_qty
      }
      return false
    }
    return true
  }

  /**
   * getCartFromStorage
   */
  function getCartFromStorage() {
    const storageData = $storage.get()
    if (storageData) cart.value = storageData
  }

  /**
   * getCurrencies
   */
  async function getCurrencies() {
    currencies.value = (await $service.currency.list()).data
  }

  /**
   * removeFromCart
   * @param item
   */
  function removeCartOffer(item: OrderItem) {
    // check if exists
    const existsIndex = cart.value.findIndex((c) => c.id === item.id)
    // if exists add qty
    if (existsIndex >= 0) {
      // if qty === 1 remove
      if (cart.value[existsIndex].qty === 1) cart.value.splice(existsIndex, 1)
      else cart.value[existsIndex].qty--
    }
    saveCartOnStorage()
  }

  /**
   * saveCart
   */
  function saveCartOnStorage() {
    $storage.set(cart.value)
  }

  return {
    categories,
    cart,
    currencies,
    homeOffers,
    homePagination,
    incommingOffers,
    incommingPagination,
    // Methods
    addCartOffer,
    canAddOffer,
    getCartFromStorage,
    getCurrencies,
    removeCartOffer,
    saveCartOnStorage
  }
})

export interface Search {
  title?: string
  offers?: ShopOffer[]
  filter?: string
}
