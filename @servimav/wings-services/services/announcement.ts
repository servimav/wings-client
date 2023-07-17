import type { AxiosInstance } from 'axios'
import { generateCrud } from '../crud'
import type { PaginatedData } from '../types'

export default function init(api: AxiosInstance) {
  const baseURL = '/announcement'

  const crud = generateCrud<Announcement>({
    api,
    baseURL
  })

  return {
    ...crud,
    filter: (params: { page?: number }) =>
      api.get<PaginatedData<Announcement>>(`${baseURL}/filter`, { params })
  }
}

/**
 * -----------------------------------------
 *	Types
 * -----------------------------------------
 */

export interface Announcement {
  id: number
  name: string
  content: string
  image?: string
  type: 'image'
  available: boolean
  link: string
  target: '_blank' | '_self'
  level: number
}
