import React, { ReactElement } from 'react'
import { createStateContext } from 'react-use'

export interface IBannerMessage {
  content: ReactElement
  status: 'warning' | 'info'
}

export const [useBannerMessage, BannerProvider] = createStateContext<IBannerMessage | undefined>(undefined)
