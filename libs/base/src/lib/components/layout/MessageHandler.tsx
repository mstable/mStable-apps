import React from 'react'

import { ExternalLink } from '@apps/dumb-components'
import { MassetConfig } from '@apps/masset-provider'

import { IBannerMessage } from '../../context/BannerProvider'

interface Props {
  recollat(massetConfig: MassetConfig): IBannerMessage
  polygon(): IBannerMessage
}

export const MessageHandler: Props = {
  recollat: (massetConfig: MassetConfig) => {
    return {
      title: `${massetConfig.formattedName} is currently undergoing recollateralisation. `,
      subtitle: `During this time,
    mAsset functionality will be reduced in order to restore a healthy
    basket state.`,
      emoji: '⚠️',
    }
  },
  polygon: () => ({
    title: 'mStable on Polygon',
    subtitle: (
      <div>
        Bridge bAssets USDC, DAI or USDT via the <ExternalLink href="https://wallet.matic.network/bridge/">Matic Bridge</ExternalLink>.
      </div>
    ),
    emoji: '⚠️',
  }),
}
