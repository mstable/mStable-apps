import { useMemo } from 'react'

import { StakingRewardsWithPlatformToken__factory } from '@apps/artifacts/typechain'
import { BigDecimal } from '@apps/bigdecimal'
import { Button } from '@apps/dumb-components'
import { TransactionManifest } from '@apps/transaction-manifest'
import styled from 'styled-components'
import { useAccount, useContractReads, useSigner } from 'wagmi'

import { usePropose } from '../../context/TransactionsProvider'
import { Address, TokenIconSvg } from '../core'
import { BalancerPoolTokenABI, StakingABI, UniswapStakedContractABI } from './constants'
import { getColor, getTokenIcon } from './utils'

import type { Interfaces } from '@apps/types'

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

export const WithdrawCard = ({ contract: { address, poolType, info, name } }: WithdrawCardProps) => {
  const { address: account } = useAccount()
  const { data: signer } = useSigner()
  const { data: uniContract } = useContractReads({
    contracts: [
      { addressOrName: address, contractInterface: StakingABI, functionName: 'stakingToken' },
      { addressOrName: address, contractInterface: StakingABI, functionName: 'balanceOf', args: [account] },
    ],
    enabled: !!account,
  })
  const abi = poolType === 'uni' ? UniswapStakedContractABI : BalancerPoolTokenABI
  const { data: stakedToken } = useContractReads({
    contracts: [
      { addressOrName: uniContract?.[0] as unknown as string, contractInterface: abi, functionName: 'name' },
      { addressOrName: uniContract?.[0] as unknown as string, contractInterface: abi, functionName: 'decimals' },
      { addressOrName: uniContract?.[0] as unknown as string, contractInterface: abi, functionName: 'symbol' },
    ],
    enabled: !!uniContract?.[0],
  })
  const propose = usePropose()
  const balance = useMemo(() => {
    if (!uniContract?.[1] || !stakedToken?.[1] || !stakedToken?.[2]) return BigDecimal.ZERO

    return new BigDecimal(uniContract[1], stakedToken[1] as unknown as number)
  }, [stakedToken, uniContract])

  if (!signer) return null

  const handleExit = () => {
    poolType === 'vmta'
      ? window.location.replace('https://staking.mstable.app/#/stake?migrate=true')
      : propose<Interfaces.StakingRewardsWithPlatformToken, 'withdraw'>(
          new TransactionManifest(
            StakingRewardsWithPlatformToken__factory.connect(address, signer),
            'exit',
            [],
            {
              present: `Exiting ${balance.format(4)} ${stakedToken?.[2]}`,
              past: `Exited ${balance.format(4)} ${stakedToken?.[2]}`,
            },
            'exitUniswap',
          ),
        )
  }

  return (
    <Card borderColor={getColor(poolType)}>
      <Header>
        <TokenIconSvg symbol={getTokenIcon(poolType)} width={40} height={40} />
        <TitleContainer>
          <span className="title">{name}</span>
          <Address address={address} type="account" />
        </TitleContainer>
        <span className="value">{`${balance.format(4)} ${stakedToken?.[2]}`}</span>
      </Header>
      <Content>{info}</Content>
      <Button onClick={handleExit}>{poolType === 'vmta' ? 'Use V1 withdraw' : 'Exit'}</Button>
    </Card>
  )
}
