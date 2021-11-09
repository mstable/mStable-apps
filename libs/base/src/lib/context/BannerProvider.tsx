import { ReactNode } from 'react'
import { createStateContext } from 'react-use'

export interface IBannerMessage {
  title: string
  subtitle?: ReactNode
  emoji: string
  url?: string
}

export const [useBannerMessage, BannerProvider] = createStateContext<IBannerMessage | undefined>(undefined)
