import type { AxiosInstance } from 'axios'
import type { GeoCoords } from './geoLocation'
import type { CurrencyCode, ShopOffer } from './shopOffer'
import type { User } from './user'
import type { STATUS } from '../const'
import { generateCrud } from '../crud'
import type { PaginatedData } from '../types'

export default function init(api: AxiosInstance) {
  const baseUrl = '/shop/orders'

  const crud = generateCrud<ShopOrder, ShopOrderCreate, ShopOrderUpdate>({
    api,
    baseUrl
  })

  return {
    ...crud,
    show: (id: number, params: { currency: string }) =>
      api.get<ShopOrder>(`${baseUrl}/${id}`, { params }),
    filter: (params: ShopOrderFilter) =>
      api.get<PaginatedData<ShopOrder>>(`${baseUrl}/filter`, { params }),
    mine: (params: Omit<ShopOrderFilter, 'customer_id' | 'location_id'>) =>
      api.get<PaginatedData<ShopOrder>>(`${baseUrl}/mine`, { params })
  }
}

/**
 * -----------------------------------------
 *	Types
 * -----------------------------------------
 */

/**
 * ShopOrder
 */
export interface ShopOrder {
  id: number
  customer: User
  delivery_status: STATUS
  delivery_details: DeliveryDetails
  delivery_price: number
  delivery_date?: string
  offers_price: number
  service_price: number
  items: OrderItem[]
  payment_type: PaymentType
}

/**
 * ShopOrderCreate
 */
export interface ShopOrderCreate {
  items: Array<{ id: number; qty: number }>
  delivery_details: DeliveryDetails
  currency?: CurrencyCode
  message?: string
  payment_type: PaymentType
}

/**
 * ShopOrderUpdate
 */
export interface ShopOrderUpdate {
  currency?: CurrencyCode
  delivery_status?: STATUS
  delivery_date?: string
}

/**
 * ShopOrderFilter
 */
export interface ShopOrderFilter {
  status?: STATUS
  currency?: CurrencyCode
  location_id?: number
  customer_id?: number
}

/**
 * OrderOffer
 */
export interface OrderItem {
  id: number
  qty: number
  name: string
  image: string
  price: number
  offer?: ShopOffer
}

/**
 * DeliveryDetails
 */
export interface DeliveryDetails {
  name: string
  contact: string
  address: string
  coords?: GeoCoords
  location_id: number
}

export type PaymentType = 'CASH_TOTAL' | 'TRANSFER_PARTIAL' | 'TRANSFER_TOTAL'
