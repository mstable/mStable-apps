import React, { FC } from 'react'
import styled from 'styled-components'

import { ChainIds, useNetwork } from '../../context/NetworkProvider'

const Container = styled.div`
  background: ${({theme}) => theme.color.yellowBorder};
  text-align: center;
  font-size: 0.75rem;
  line-height: 1.5rem;
  border-bottom: 1px solid ${({theme}) => theme.color.yellowBorder};
  overflow-x: scroll;
  overflow-wrap: normal;

  p {
    opacity: 0.75;

    a {
      opacity: 1;
    }
  }
`

export const GraphWarning: FC = () => {
  const { chainId } = useNetwork()
  const isPolygon = chainId === ChainIds.MaticMainnet

  if (!isPolygon) return null
  return (
    <Container>
      <p>
        Our data provider sometimes falls out of sync on Polygon. If you are experiencing issues please check{' '}
        <a href="https://status.thegraph.com/" target="_blank" rel="noopener noreferrer">
          here
        </a>{' '}
        before our discord
      </p>
    </Container>
  )
}
