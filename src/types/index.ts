import type { ShopCategory, ShopOffer } from '@servimav/wings-services'

interface Image {
  src: string
  alt: string
}

interface OfferAttribute {
  key: string
  value: string | number
}

export type Offer = ShopOffer

export type Category = ShopCategory
