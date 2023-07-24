import type { WhatsappMessage } from '@/types'
import { ADMIN_PHONE } from './defaults'

/**
 * formatDate
 * @param date text in date format
 */
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * useStorage
 * @param key
 * @returns
 */
export function useStorage<T = unknown>(key: string) {
  return {
    get: () => {
      const data = localStorage.getItem(`${window.location.host}/${key}`)
      return data ? (JSON.parse(data) as T) : null
    },
    set: (data: T) => localStorage.setItem(`${window.location.host}/${key}`, JSON.stringify(data)),
    remove: () => localStorage.removeItem(`${window.location.host}/${key}`)
  }
}

/**
 * toCurrency
 * @param val
 * @returns
 */
export function toCurrency(val: number, round = true) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  })

  return round ? formatter.format(Math.round(val / 10) * 10) : formatter.format(val)
}

/**
 * scrollTop
 */
export function scrollTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

/**
 * defaultImage
 * @returns
 */
export function setDefaultImage(event: Event) {
  const target = event.target as HTMLImageElement
  target.src = '/images/default.png'
}

/**
 * toNearTenMultiple
 * @param val
 * @param type
 * @returns
 */
export function roundX10(val: number, type: 'round' | 'ceil' | 'roof' = 'round') {
  if (type === 'ceil') return Math.ceil(val / 10) * 10
  else return Math.round(val / 10) * 10
}

/**
 * sendWhatsappMessage
 * @param param WhatsappMessage
 */
export function sendWhatsappMessage({ message, phone }: WhatsappMessage) {
  const whatsappPhone = phone ?? ADMIN_PHONE
  const whatsapp = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`
  window.location.assign(whatsapp)
}
