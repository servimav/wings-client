import type { ShopCategory, ShopOffer } from '@servimav/wings-services'

export type Offer = ShopOffer

export type Category = ShopCategory

export interface WhatsappMessage {
  message: string
  phone?: string
}
