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
  /* position: fixed;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%); */
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem 4rem 1rem;

  @media (max-width: 400px) {
    top: 0;
    left: 0;
    width: 1;
  }
`

const Modal = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  background-color: rgba(44, 48, 78, 0.4);
  backdrop-filter: blur(2px);
  border-radius: 1rem;
  border: 1px solid #fff6a1;
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
          <p>
            mStable is sunsetting its entire product line, earning interest through the protocol has been disabled and the project’s smart
            contracts are no longer operated by the mStableDAO.
          </p>
          <p>It is strongly advised to withdraw all liquidity positions from the protocol. Read more in the official announcement.</p>
          <a href="" target="_blank" rel="noopener noreferrer">
            Read More
          </a>
        </Modal>
      </Container>
    ),
  },
}
