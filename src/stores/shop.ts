import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  type ShopCategory,
  type ShopOffer,
  type OrderOffer,
  STOCK_TYPE
} from '@servimav/wings-services'
import { useStorage } from '@/helpers'

const STORE_NAME = 'useShopStore'
const $storage = useStorage<OrderOffer[]>(STORE_NAME)

export const useShopStore = defineStore(STORE_NAME, () => {
  // store all categories
  const categories = ref<ShopCategory[]>([])
  // cart
  const cart = ref<OrderOffer[]>([])

  /**
   * -----------------------------------------
   *	Methods
   * -----------------------------------------
   */

  /**
   * addCartOffer
   * @param cartOffer
   * @returns boolean
   */
  function addCartOffer(cartOffer: OrderOffer): boolean {
    if (!canAddOffer(cartOffer)) return false
    // check if exists
    const existsIndex = cart.value.findIndex((c) => c.offer.id === cartOffer.offer.id)
    // if exists add qty
    if (existsIndex >= 0) {
      cart.value[existsIndex].qty++
    }
    // Store
    else {
      cart.value.push(cartOffer)
    }
    saveCartOnStorage()
    return true
  }

  /**
   * canAddOffer
   * @param cartOffer
   * @returns
   */
  function canAddOffer(cartOffer: OrderOffer): boolean {
    // check if exists
    const existsIndex = cart.value.findIndex((c) => c.offer.id === cartOffer.offer.id)
    // if exists add qty
    if (existsIndex >= 0) {
      const stockType = cartOffer.offer.stock_type
      if (stockType === STOCK_TYPE.INFINITY) return true
      else if (stockType === STOCK_TYPE.OUT || stockType === STOCK_TYPE.ON_WAY) return false
      else if (stockType === STOCK_TYPE.LIMITED && cartOffer.offer.stock_qty) {
        const cartQty = cart.value[existsIndex].qty
        return cartQty < cartOffer.offer.stock_qty
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
   * @param cartOffer
   */
  function removeCartOffer(cartOffer: OrderOffer) {
    // check if exists
    const existsIndex = cart.value.findIndex((c) => c.offer.id === cartOffer.offer.id)
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
