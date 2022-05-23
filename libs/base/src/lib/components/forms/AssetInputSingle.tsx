import styled from 'styled-components'

import { AssetInput } from './AssetInput'

import type { BigDecimal } from '@apps/bigdecimal'
import type { SubscribedToken } from '@apps/types'
import type { FC } from 'react'

interface Props {
  className?: string
  isFetching?: boolean
  formValue?: string
  handleSetAmount?: (formValue?: string) => void
  handleSetMax?: (amount?: string) => void
  spender?: string
  token?: SubscribedToken
  stakedBalance?: BigDecimal
  preferStaked?: boolean
}

const Input = styled(AssetInput)`
  background: ${({ theme }) => theme.color.background[0]};
  height: 3.5rem;
  padding: 0.25rem 0.25rem 0.25rem 0;

  input {
    padding-left: 0.75rem;
  }

  button {
    max-height: 3.5rem;
  }
`

const Balance = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;

  > *:first-child {
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.color.bodyAccent};

    span {
      background: ${({ theme }) => theme.color.background[0]};
      border-radius: 0.25rem;
      padding: 0 0.25rem;
      font-size: 0.75rem;
      margin-left: 0.5rem;
    }
  }

  > *:last-child {
    ${({ theme }) => theme.mixins.numeric};
  }
`

const Container = styled.div`
  background: ${({ theme }) => theme.color.background[3]};
  border-radius: 0.75rem;
`

export const AssetInputSingle: FC<Props> = ({
  className,
  isFetching,
  formValue,
  token,
  handleSetMax,
  handleSetAmount,
  spender,
  stakedBalance,
  preferStaked = false,
}) => {
  return (
    <Container className={className}>
      <Input
        isFetching={isFetching}
        address={token?.address}
        formValue={formValue}
        handleSetMax={() => handleSetMax?.(preferStaked ? stakedBalance?.string : token?.balance?.string)}
        handleSetAmount={handleSetAmount}
        spender={preferStaked ? undefined : spender}
        hideToken
      />
      <Balance>
        <div>
          {preferStaked ? 'Staked' : 'Wallet'} <span>{token?.symbol}</span>
        </div>
        <div>{preferStaked ? stakedBalance?.toFixed(4) : token?.balance?.toFixed(4)}</div>
      </Balance>
    </Container>
  )
}
