import { ThemedSkeleton } from '@apps/dumb-components'
import styled from 'styled-components'

import type { AddressOption, FetchState, SubscribedToken } from '@apps/types'
import type { FC } from 'react'

interface Props {
  inputLabel?: string
  outputLabel?: string
  inputToken?: AddressOption | SubscribedToken
  outputToken?: AddressOption | SubscribedToken
  exchangeRate: FetchState<number>
}

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 0.5rem;
  font-size: 0.875rem;
  text-align: right;
  color: ${({ theme }) => theme.color.grey};

  span {
    white-space: pre;
  }
`

const Numeric = styled.span`
  ${({ theme }) => theme.mixins.numeric};
`

export const ExchangeRate: FC<Props> = ({ exchangeRate: { fetching, value }, inputToken, outputToken, inputLabel, outputLabel }) => {
  const hasInput = inputLabel || inputToken
  return (
    <Container>
      {fetching ? (
        <ThemedSkeleton height={16} width={150} />
      ) : value ? (
        <>
          <span>≈ </span>
          <Numeric>{value.toFixed(6)}</Numeric>
          <span> {outputLabel ?? outputToken?.symbol} </span>
          {hasInput && <span>per {inputLabel ?? inputToken?.symbol}</span>}
        </>
      ) : (
        <span>&nbsp;</span>
      )}
    </Container>
  )
}
