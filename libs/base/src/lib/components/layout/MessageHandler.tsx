import React from 'react'

import { ReactComponent as WarningIcon } from '@apps/icons/warning-alt.svg'
import styled from 'styled-components'

import type { MassetConfig } from '@apps/masset-provider'

import type { BannerMessageProps } from '../../context/BannerProvider'

interface Props {
  recollat: (massetConfig: MassetConfig) => BannerMessageProps
  graph: BannerMessageProps
  olympus: BannerMessageProps
  renbtc: BannerMessageProps
  shutdown: BannerMessageProps
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`

const Modal = styled.div`
  padding: 2rem;
  display: flex;
  max-width: 968px;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  backdrop-filter: blur(2px);
  border-radius: 1rem;
  border: 1px solid #fac371;
  font-size: 1rem;
`

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
  renbtc: {
    status: 'warning',
    content: (
      <p>
        On the 20th of December 2022, renBTC will no longer be able to bridged back to its native network. It is recommended to withdraw any
        supply positions.{' '}
        <a href="https://twitter.com/mstable_/status/1601215719605403650" target="_blank" rel="noopener noreferrer">
          Learn more
        </a>
      </p>
    ),
  },
  shutdown: {
    status: 'none',
    content: (
      <Container>
        <Modal>
          <WarningIcon />
          <p>mStable has been aquired by dHedge. Following the outlined aquisition update, certain mStable products will be sunset.</p>
          <p>
            The contracts will always remain live and allow for withdrawals. However, it is recommended to withdraw remaining assets from
            the contracts since value accrual has been disabled.
          </p>
          <p>
            All products, except for mUSD on Ethereum mainnet and Polygon, are being sunset. Staking MTA and governance has been disabled,
            and staked assets are unlocked. Use the withdrawal app to access remaining funds.
          </p>
          <a
            href="https://medium.com/mstable/mstable-acquisition-completed-by-dhedge-the-next-chapter-of-defi-yield-vaults-begins-79a326157132"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read the Announcement
          </a>
        </Modal>
      </Container>
    ),
  },
}
