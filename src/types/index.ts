interface Image {
  src: string
  alt: string
}

export interface Product {
  title: string
  description?: string
  image: Image
  price: number
}
