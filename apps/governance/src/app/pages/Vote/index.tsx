import React, { FC, useMemo } from 'react'
import styled from 'styled-components'
import { UserLookup, InfoBox, Button } from '@apps/components/core'

import { GovernancePageHeader } from '../../components/GovernancePageHeader'
import { Leaderboard } from './Leaderboard'
import { TokenIcon } from '@apps/components/icons'
import { useStakedToken, useStakedTokenQuery } from '../../context/StakedTokenProvider'
import { useHistory } from 'react-router-dom'
import { usePropose } from '@apps/base/context/transactions'
import { useOwnAccount, useSigner } from '@apps/base/context/account'
import { TransactionManifest, Interfaces } from '@apps/transaction-manifest'
import { StakedToken__factory } from '@apps/artifacts/typechain'
import { DelegateInput } from '../../components/DelegateInput'

const DOCS_URL = 'https://docs.mstable.org/'
const SNAPSHOT_URL = 'https://snapshot.org/#/mstablegovernance.eth'

const DelegationBox = styled(InfoBox)`
  div {
    display: flex;
  }

  > div {
    align-items: center;
    justify-content: space-between;
  }

  > div > div:first-child {
    gap: 0.5rem;
  }

  > div > div:last-child:not(:first-child) {
    display: flex;
    gap: 0.25rem;
    border: 1px solid ${({ theme }) => theme.color.defaultBorder};
    border-radius: 0.75rem;
    padding: 0.5rem;
    font-size: 0.875rem;

    img,
    div {
      min-height: 1.25rem;
      min-width: 1.25rem;
      height: 1.25rem;
      width: 1.25rem;
    }

    span {
      ${({ theme }) => theme.mixins.numeric};
      color: ${({ theme }) => theme.color.body};
    }
  }
`

const StyledDelegateInput = styled(DelegateInput)`
  padding: 0;

  input {
    border: 1px solid ${({ theme }) => theme.color.defaultBorder};
    height: inherit;
    width: 12rem;
  }
`

const VoteBox = styled(InfoBox)`
  div {
    display: flex;
    gap: 0.5rem;
  }
`

const Row = styled.div`
  display: flex;
  gap: 0.75rem;

  > *:first-child {
    flex-basis: 60%;
  }

  > *:last-child {
    flex-basis: 40%;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const External: FC<{ highlighted?: boolean }> = ({ highlighted }) => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 2C3.82843 2 1 2 1 2V10H9V7.5" stroke={highlighted ? 'white' : 'black'} />
    <path d="M6 5.5L10.5 1M10.5 1H7.16667M10.5 1V4.33333" stroke={highlighted ? 'white' : 'black'} />
  </svg>
)

export const Vote: FC = () => {
  const { selected: stakedTokenAddress, options } = useStakedToken()
  const { data } = useStakedTokenQuery()

  const history = useHistory()
  const account = useOwnAccount()
  const propose = usePropose()
  const signer = useSigner()

  // TODO;
  const delegatee = 'Bob Ross'
  const delegateeId = data?.stakedToken?.accounts?.[0]?.delegatee?.id
  const isSelfDelegated = delegateeId?.toLowerCase() === account?.toLowerCase()

  // FIXME;
  const { votingPower } = useMemo<{ votingPower?: number[] }>(() => {
    const account = data?.stakedToken?.accounts?.[0]
    if (!data || !account) {
      return {}
    }
    const {
      balance: { votesBD },
    } = account
    return {
      votingPower: [votesBD.simple],
    }
  }, [data])

  const handleDelegate = (address: string) => {
    if (!signer || !data) return

    propose<Interfaces.StakedToken, 'delegate'>(
      new TransactionManifest(StakedToken__factory.connect(stakedTokenAddress, signer), 'delegate', [address], {
        present: `Delegating to ${address}`,
        past: `Delegated to ${address}`,
      }),
    )
  }

  const handleUndelegate = () => {
    if (!signer || !data) return

    propose<Interfaces.StakedToken, 'delegate'>(
      new TransactionManifest(StakedToken__factory.connect(stakedTokenAddress, signer), 'delegate', [account], {
        present: `Removing delegation`,
        past: `Removed delegation`,
      }),
    )
  }

  return (
    <Container>
      <GovernancePageHeader title="Vote" subtitle="View list of voting addresses and delegate" />
      <Row>
        <DelegationBox subtitle="Delegated to" title={isSelfDelegated ? 'Self' : delegatee} dashed={false}>
          <div>
            <div>
              <Button highlighted onClick={() => history.push(`/vote/${delegateeId}`)}>
                View Profile
              </Button>
              {isSelfDelegated ? <StyledDelegateInput onClick={handleDelegate} /> : <Button onClick={handleUndelegate}>Undelegate</Button>}
            </div>
            {!isSelfDelegated && (
              <div>
                Delegated &nbsp;
                <TokenIcon symbol={options[stakedTokenAddress]?.icon.symbol} />
                <span>{votingPower?.[0]}</span>
              </div>
            )}
          </div>
        </DelegationBox>
        <VoteBox subtitle="Participate" title="Vote">
          <div>
            <Button highlighted onClick={() => window.open(SNAPSHOT_URL)}>
              Snapshot <External highlighted />
            </Button>
            <Button onClick={() => window.open(DOCS_URL)}>
              Learn More <External />
            </Button>
          </div>
        </VoteBox>
      </Row>
      <UserLookup />
      <Leaderboard preview />
    </Container>
  )
}
