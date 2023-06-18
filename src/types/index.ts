interface Image {
  src: string
  alt: string
}

interface OfferAttribute {
  key: string
  value: string | number
}

export interface Offer {
  name: string
  description: string
  attributes: Array<OfferAttribute>
  image: Image
  gallery: Image[]
  sell_price: number
  available: boolean
  stock_qty: number
}

export interface Category {
  name: string
}
