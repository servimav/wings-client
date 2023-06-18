import type { Category, Offer } from '@/types'

export const OFFERS: Array<Offer> = [
  {
    name: 'Sueter Blanco',
    description:
      'Un suéter blanco clásico confeccionado en algodón, con una textura suave y esponjosa al tacto. Presenta un diseño de punto liso, con un cuello redondo y mangas largas. El suéter muestra detalles mínimos, como un borde de canalé en los puños y el dobladillo, además de botones',
    attributes: [
      { key: 'Color', value: 'Blanco' },
      { key: 'Talla', value: 'M' },
      { key: 'Material', value: 'Algodón' },
      { key: 'Tipo de tejido', value: 'Punto' },
      { key: 'Diseño', value: 'Cuello Redondo' },
      { key: 'Estilo', value: 'Elegante' },
      { key: 'Durabilidad', value: 'Resistente de larga duración y fácil de cuidar' }
    ],
    image: { src: 'sueter/1.png', alt: 'Sueter 1' },
    gallery: [
      { src: 'sueter/1.png', alt: 'Sueter 1' },
      { src: 'sueter/2.png', alt: 'Sueter 2' },
      { src: 'sueter/3.png', alt: 'Sueter 3' }
    ],
    sell_price: 111.55,
    available: true,
    stock_qty: 3
  },
  {
    name: 'Adidas',
    description: 'description',
    attributes: [
      { key: 'Color', value: 'Blanco' },
      { key: 'Talla', value: 'M' },
      { key: 'Material', value: 'Algodón' },
      { key: 'Tipo de tejido', value: 'Punto' },
      { key: 'Diseño', value: 'Cuello Redondo' },
      { key: 'Estilo', value: 'Elegante' },
      { key: 'Durabilidad', value: 'Resistente de larga duración y fácil de cuidar' }
    ],
    image: { src: 'adidas/1.png', alt: 'Adidas 1' },
    gallery: [
      { src: 'adidas/1.png', alt: 'Adidas 1' },
      { src: 'adidas/2.png', alt: 'Adidas 2' },
      { src: 'adidas/3.png', alt: 'Adidas 3' }
    ],
    sell_price: 105.2,
    available: true,
    stock_qty: 2
  }
]

export const CATEGORIES: Array<Category> = [
  { name: 'Recientes' },
  { name: 'Accesorios' },
  { name: 'Hogar' },
  { name: 'Populares' },
  { name: 'Rebajas' }
]
