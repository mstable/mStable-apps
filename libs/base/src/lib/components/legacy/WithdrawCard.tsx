import { StakingRewardsWithPlatformToken__factory } from '@apps/artifacts/typechain'
import { Button } from '@apps/dumb-components'
import { TransactionManifest } from '@apps/transaction-manifest'
import styled from 'styled-components'
import { useAccount, useBalance, useSigner } from 'wagmi'

import { usePropose } from '../../context/TransactionsProvider'
import { Address, TokenIconSvg } from '../core'

import type { Interfaces } from '@apps/types'
import type { BigNumberish } from 'ethers'

import type { LegacyContract } from './types'

type WithdrawCardProps = {
  contract: LegacyContract
}

const Card = styled.div<{ borderColor: string }>`
  border-radius: 8px;
  border: 1px solid ${({ borderColor }) => borderColor};
  display: flex;
  flex-direction: column;
  padding: 1rem;

  svg {
    color: ${({ borderColor }) => borderColor};
  }
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;

  .value {
    font-family: 'DM Mono', monospace;
    font-weight: bold;
    padding-top: 6px;
  }

  .position {
    padding-top: 6px;
  }
`

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-grow: 1;

  .title {
    font-size: 1.1rem;
    font-weight: bold;
  }
`

const Content = styled.p`
  padding: 2rem 0;
`

export const WithdrawCard = ({ contract: { address, color, info, name, tokenIcon } }: WithdrawCardProps) => {
  const { address: account } = useAccount()
  const { data: signer } = useSigner()
  const { data: balance } = useBalance({ addressOrName: account, token: address })
  const propose = usePropose()

  if (!signer) return null

  const handleWithdraw = () => {
    propose<Interfaces.StakingRewardsWithPlatformToken, 'withdraw'>(
      new TransactionManifest(
        StakingRewardsWithPlatformToken__factory.connect(address, signer),
        'withdraw',
        [balance?.value as BigNumberish],
        {
          present: `Withdrawing ${balance?.formatted}`,
          past: `Withdrew ${balance?.formatted}`,
        },
        'withdrawLegacy',
      ),
    )
  }

  return (
    <Card borderColor={color}>
      <Header>
        <TokenIconSvg symbol={tokenIcon} width={40} height={40} />
        <TitleContainer>
          <span className="title">{name}</span>
          <Address address={address} type="account" />
        </TitleContainer>
        <span className="value">{`${balance?.formatted} ${balance?.symbol}`}</span>
      </Header>
      <Content>{info}</Content>
      <Button onClick={handleWithdraw}>Withdraw</Button>
    </Card>
  )
}
