import React, { FC, useMemo } from 'react'
import styled from 'styled-components'

import { InfoBox, Button, ButtonExternal } from '@apps/components/core'
import { TokenIcon } from '@apps/components/icons'
import { useHistory } from 'react-router-dom'
import { usePropose } from '@apps/base/context/transactions'
import { useOwnAccount } from '@apps/base/context/account'
import { TransactionManifest, Interfaces } from '@apps/transaction-manifest'

import { useStakedToken, useStakedTokenContract, useStakedTokenQuery } from '../../context/StakedTokenProvider'
import { GovernancePageHeader } from '../../components/GovernancePageHeader'
import { UserLookup } from '../../components/UserLookup'
import { ViewportWidth } from '@apps/base/theme'
import { truncateAddress } from '@apps/formatters'
import { Leaderboard } from './Leaderboard'
import { useDelegateesAll } from '../../context/DelegateeListsProvider'
import { constants } from 'ethers'
import { DelegateSelectionAlt } from '../../components/DelegateSelectionAlt'

const DOCS_URL = 'https://app.gitbook.com/@mstable/s/mstable-docs/'
const SNAPSHOT_URL = 'https://snapshot.org/#/mstablegovernance.eth'

const DelegationBox = styled(InfoBox)<{ isTitleAddress: boolean }>`
  div {
    display: flex;
  }

  > div {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
    justify-content: space-between;
  }

  > div > div {
    flex-direction: column;
    width: 100%;

    button {
      width: 100%;
    }
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

  > h3 {
    ${({ isTitleAddress, theme }) => isTitleAddress && theme.mixins.numeric};
  }

  @media (min-width: ${ViewportWidth.m}) {
    > div > div {
      flex-direction: column;
      width: 100%;
      button {
        flex: 1;
      }
    }
  }

  @media (min-width: ${ViewportWidth.l}) {
    > div {
      flex-direction: row;
      align-items: center;
      gap: 0;
    }
    > div > div {
      flex-direction: row;
      width: inherit;

      button {
        width: inherit;
      }
    }
  }
`

const VoteBox = styled(InfoBox)`
  div {
    display: flex;
    flex-direction: row;
    flex-direction: column;
    gap: 0.5rem;
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

export const Vote: FC = () => {
  const { selected: stakedTokenAddress, options } = useStakedToken()
  const { data } = useStakedTokenQuery()

  const history = useHistory()
  const account = useOwnAccount()
  const propose = usePropose()
  const stakedTokenContract = useStakedTokenContract()
  const delegateesAll = useDelegateesAll()

  // TODO;
  const delegateeId = data?.stakedToken?.accounts?.[0]?.delegatee?.id ?? account
  const displayName = delegateesAll[delegateeId]?.displayName
  const isSelfDelegated = delegateeId?.toLowerCase() === account?.toLowerCase()

  const { votingPower } = useMemo<{ votingPower?: number[] }>(() => {
    const account = data?.stakedToken?.accounts?.[0]
    if (!data || !account) {
      return {}
    }
    const {
      balance: { votesBD, rawBD },
    } = account
    // FIXME: - votesBD comes back as 0 when there is no multiplier, should not be the case.
    const votingPower = [!!votesBD.simple ? votesBD.simple : rawBD.simple]
    return { votingPower }
  }, [data])

  const handleRowClick = (id: string) => history.push(`/vote/${id}`)

  const handleDelegate = (address: string) => {
    if (!stakedTokenContract || !data || address === constants.AddressZero) return

    propose<Interfaces.StakedToken, 'delegate'>(
      new TransactionManifest(stakedTokenContract, 'delegate', [address], {
        present: `Delegating to ${truncateAddress(address)}`,
        past: `Delegated to ${truncateAddress(address)}`,
      }),
    )
  }

  const handleUndelegate = () => {
    if (!stakedTokenContract || !data || account === constants.AddressZero) return

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
          <DelegationBox
            subtitle="Delegated to"
            title={isSelfDelegated ? 'Self' : displayName ?? truncateAddress(delegateeId)}
            dashed={false}
            isTitleAddress={!displayName}
          >
            <div>
              <div>
                <Button highlighted onClick={() => history.push(`/vote/${delegateeId}`)}>
                  View Profile
                </Button>
                {isSelfDelegated ? (
                  <DelegateSelectionAlt handleDelegate={handleDelegate} />
                ) : (
                  <Button onClick={handleUndelegate}>Undelegate</Button>
                )}
              </div>
              {!isSelfDelegated && (
                <div>
                  Delegated &nbsp;
                  <TokenIcon symbol={options[stakedTokenAddress]?.icon.symbol} />
                  <span>{votingPower?.[0]?.toFixed(2) ?? 100}</span>
                </div>
              )}
            </div>
          </DelegationBox>
          <VoteBox subtitle="Participate" title="Vote">
            <div>
              <ButtonExternal highlighted onClick={() => window.open(SNAPSHOT_URL)}>
                Snapshot
              </ButtonExternal>
              <ButtonExternal onClick={() => window.open(DOCS_URL)}>Learn More</ButtonExternal>
            </div>
          </VoteBox>
        </Row>
        <UserLookup title="Lookup user" onClick={address => history.push(`/vote/${address}`)} />
        <Leaderboard preview onClick={handleRowClick} />
      </div>
    </Container>
  )
}
