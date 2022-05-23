import { CountUp } from '@apps/dumb-components'
import styled from 'styled-components'

import { TokenIcon } from './TokenIcon'

import type { FC } from 'react'

interface Props {
  token: string
  title: string
  balance?: number
  className?: string
}

const StyledTokenIcon = styled(TokenIcon)`
  width: 1.5rem;
  height: auto;
`

const StyledCountUp = styled(CountUp)`
  font-size: 1.25rem;
  font-weight: 300;
`

const Widget = styled.div`
  padding: 1rem 0;

  h4 {
    padding-bottom: 0.5rem;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.color.bodyAccent};
  }

  > * {
    padding: 0 1.25rem;
  }

  > div {
    align-items: center;
    display: flex;
    gap: 1rem;
  }
`

export const BalanceWidget: FC<Props> = ({ token, title, balance, className }) =>
  balance !== undefined ? (
    <Widget className={className}>
      <h4>{title}</h4>
      <div>
        <StyledTokenIcon symbol={token} />
        <StyledCountUp end={balance} />
      </div>
    </Widget>
  ) : null
