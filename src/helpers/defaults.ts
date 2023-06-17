import type { Category, Product } from '@/types'

export const PRODUCTS: Array<Product> = [
  {
    title: 'Sueter',
    image: { src: 'products/sueter-small.png', alt: 'Sueter' },
    price: 105
  },
  { title: 'Adidas', image: { src: 'products/adidas-small.png', alt: 'Adidas' }, price: 105 },
  {
    title: 'Sueter',
    image: { src: 'products/sueter-small.png', alt: 'Sueter' },
    price: 105
  },
  { title: 'Adidas', image: { src: 'products/adidas-small.png', alt: 'Adidas' }, price: 105 }
]

export const CATEGORIES: Array<Category> = [
  { name: 'Recientes' },
  { name: 'Accesorios' },
  { name: 'Hogar' },
  { name: 'Populares' },
  { name: 'Rebajas' }
]
