import React, { FC, useMemo } from 'react'
import styled from 'styled-components'

import {  InfoBox, Button } from '@apps/components/core'
import { TokenIcon } from '@apps/components/icons'
import { useHistory } from 'react-router-dom'
import { usePropose } from '@apps/base/context/transactions'
import { useOwnAccount } from '@apps/base/context/account'
import { TransactionManifest, Interfaces } from '@apps/transaction-manifest'

import { useStakedToken, useStakedTokenContract, useStakedTokenQuery } from '../../context/StakedTokenProvider'
import { GovernancePageHeader } from '../../components/GovernancePageHeader'
import { DelegateInput } from '../../components/DelegateInput'
import { UserLookup } from '../../components/UserLookup'
import { ViewportWidth } from '@apps/base/theme'
import { truncateAddress } from '@apps/formatters'
import { Leaderboard } from './Leaderboard'

const DOCS_URL = 'https://docs.mstable.org/'
const SNAPSHOT_URL = 'https://snapshot.org/#/mstablegovernance.eth'

const DelegationBox = styled(InfoBox)`
  div {
    display: flex;
  }

  > div {
    flex-direction: column;
    gap: 0.5rem;
    justify-content: space-between;
    align-items: flex-start;
  }

  > div > div:first-child {
    gap: 0.5rem;
  }

  > div > div:last-child:not(:first-child) {
    display: flex;
    justify-content: space-between;
    gap: 0.25rem;
    border: 1px solid ${({ theme }) => theme.color.defaultBorder};
    border-radius: 0.75rem;
    padding: 0.5rem;
    font-size: 0.875rem;

    > div {
      margin-left: 1rem;
    }

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

  @media (min-width: ${ViewportWidth.l}) {
    > div {
      flex-direction: row;
      align-items: center;
      gap: 0;
    }
  }
`

const StyledDelegateInput = styled(DelegateInput)`
  padding: 0;

  input {
    border: 1px solid ${({ theme }) => theme.color.defaultBorder};
    height: 2.5rem;
    width: 12rem;
  }
`

const VoteBox = styled(InfoBox)`
  div {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    div {
      flex-direction: column;
    }
  }

  @media (min-width: ${ViewportWidth.l}) {
    div {
      flex-direction: row;
    }
  }
`

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;

    > *:first-child {
      flex-basis: 60%;
    }

    > *:last-child {
      flex-basis: 40%;
    }
  }
`

const Container = styled.div`
  > div:last-child {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
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
  const stakedTokenContract = useStakedTokenContract()

  // TODO;
  const delegateeId = data?.stakedToken?.accounts?.[0]?.delegatee?.id ?? account
  const isSelfDelegated = delegateeId?.toLowerCase() === account?.toLowerCase()

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
    if (!stakedTokenContract || !data) return

    propose<Interfaces.StakedToken, 'delegate'>(
      new TransactionManifest(stakedTokenContract, 'delegate', [address], {
        present: `Delegating to ${address}`,
        past: `Delegated to ${address}`,
      }),
    )
  }

  const handleUndelegate = () => {
    if (!stakedTokenContract || !data) return

    propose<Interfaces.StakedToken, 'delegate'>(
      new TransactionManifest(stakedTokenContract, 'delegate', [account], {
        present: `Removing delegation`,
        past: `Removed delegation`,
      }),
    )
  }

  return (
    <Container>
      <GovernancePageHeader title="Vote" subtitle="View list of voting addresses and delegate" />
      <div>
        <Row>
          <DelegationBox subtitle="Delegated to" title={isSelfDelegated ? 'Self' : truncateAddress(delegateeId)} dashed={false}>
            <div>
              <div>
                <Button highlighted onClick={() => history.push(`/vote/${delegateeId}`)}>
                  View Profile
                </Button>
                {isSelfDelegated ? (
                  <StyledDelegateInput onClick={handleDelegate} />
                ) : (
                  <Button onClick={handleUndelegate}>Undelegate</Button>
                )}
              </div>
              {!isSelfDelegated && (
                <div>
                  Delegated &nbsp;
                  <TokenIcon symbol={options[stakedTokenAddress]?.icon.symbol} />
                  <span>{votingPower?.[0] ?? 100}</span>
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
        <UserLookup title="Lookup user" onClick={address => history.push(`/vote/${address}`)} />
        <Leaderboard preview />
      </div>
    </Container>
  )
}
