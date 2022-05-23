import { createStateContext } from 'react-use'

import type { ReactElement } from 'react'

export interface BannerMessageProps {
  content: ReactElement
  status: 'warning' | 'info'
}

export const [useBannerMessage, BannerProvider] = createStateContext<BannerMessageProps | undefined>(undefined)
