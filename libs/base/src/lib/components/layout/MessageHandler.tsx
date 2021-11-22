import React, { ReactElement } from 'react'

import { MassetConfig } from '@apps/masset-provider'
import { IBannerMessage } from '../../context/BannerProvider'

interface Props {
  recollat(massetConfig: MassetConfig): IBannerMessage
  graph: IBannerMessage
  olympus: IBannerMessage
}

export const MessageHandler: Props = {
  recollat: (massetConfig: MassetConfig) => ({
    status: 'warning',
    content: (
      <p>{massetConfig.formattedName} is currently undergoing recollateralisation. mAsset functionality will be temporarily reduced.</p>
    ),
  }),
  graph: {
    status: 'warning',
    content: (
      <p>
        Our data provider sometimes falls out of sync on Polygon. If you are experiencing issues please check{' '}
        <a href="https://status.thegraph.com/" target="_blank" rel="noopener noreferrer">
          here
        </a>{' '}
        before our discord
      </p>
    ),
  },
  olympus: {
    status: 'info',
    content: (
      <p>
        We have recently partnered with{' '}
        <a
          href="https://pro.olympusdao.finance/?utm_source=mStable&utm_medium=affiliate&utm_campaign=op-affiliate"
          target="_blank"
          rel="noopener noreferrer"
        >
          Olympus Pro
        </a>{' '}
        to offer MTA bonds.{' '}
        <a
          href="https://medium.com/mstable/mstable-olympus-pro-treasury-bond-program-for-mstables-expansion-c2e6265e4fa9"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more
        </a>
      </p>
    ),
  },
}
