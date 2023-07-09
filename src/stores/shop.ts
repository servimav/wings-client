import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  type ShopCategory,
  type ShopOffer,
  type OrderItem,
  STOCK_TYPE
} from '@servimav/wings-services'
import { useStorage } from '@/helpers'

const STORE_NAME = 'useShopStore'
const $storage = useStorage<OrderItem[]>(STORE_NAME)

export const useShopStore = defineStore(STORE_NAME, () => {
  // store all categories
  const categories = ref<ShopCategory[]>([])
  // cart
  const cart = ref<OrderItem[]>([])

  // Home offers
  const homeOffers = ref<ShopOffer[]>([])
  const homePagination = ref<number>()

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
      else if (stockType === STOCK_TYPE.OUT || stockType === STOCK_TYPE.ON_WAY) return false
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
    homeOffers,
    homePagination,
    // Methods
    addCartOffer,
    canAddOffer,
    getCartFromStorage,
    removeCartOffer,
    saveCartOnStorage
  }
})

export interface Search {
  title?: string
  offers?: ShopOffer[]
  filter?: string
}
