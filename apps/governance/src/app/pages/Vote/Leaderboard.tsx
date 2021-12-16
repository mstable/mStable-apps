import React, { FC, useMemo, useState } from 'react'
import { BigDecimal } from '@apps/bigdecimal'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { useLeaderboardQuery } from '@apps/artifacts/graphql/staking'
import { useApolloClients } from '@apps/base/context/apollo'
import { Table, TableCell, TableRow, UnstyledButton } from '@apps/dumb-components'
import { ReactComponent as BackArrow } from '@apps/icons/back-arrow.svg'
import { ReactComponent as ForwardArrow } from '@apps/icons/forward-arrow.svg'
import { useStakingQuery } from '../../context'

import { useDelegateesAll } from '../../context/DelegateeLists'
import { DelegateCell } from '../../components/DelegateCell'

interface Props {
  preview?: boolean
  delegation?: boolean
  onClick: (id: string) => void
}

const StyledTable = styled(Table)`
  margin-top: 0.5rem;
`

const ViewLeaderboardRow = styled(TableRow)`
  > td {
    display: flex;
    justify-content: center;
  }

  > td > div {
    width: 100%;
    text-align: center;
  }
`

const NavigationCell = styled(TableCell)`
  width: 100%;
  display: flex;
  justify-content: space-between !important;
`

const NumericCell = styled(TableCell)`
  font-family: 'DM Mono', monospace !important;
  text-align: right;
`

export const Leaderboard: FC<Props> = ({ preview, delegation, onClick }) => {
  const [count] = useState<number>(preview ? 5 : 25)
  const [skip, setSkip] = useState<number>(0)

  const delegateesAll = useDelegateesAll()
  const clients = useApolloClients()

  const leaderboardQuery = useLeaderboardQuery({
    client: clients.staking,
    variables: { count, skip },
    pollInterval: 60e3,
  })
  const stakingQuery = useStakingQuery()

  const leaderboardItems = useMemo<{ id: string; votes: number; share: number }[]>(() => {
    // TODO could do this on subgraph
    const totalVotingToken = stakingQuery.data?.stakedTokens.reduce(
      (_total, st) => (st.token?.totalSupply ? st.token.totalSupply.bigDecimal.simple + _total : 0),
      0,
    )

    const stakers = leaderboardQuery.data?.accounts ?? []
    const hasStaked = new Set(stakers.map(a => a.id))
    const delegateesNotStaked = Object.keys(delegateesAll).filter(address => !hasStaked.has(address))

    return [...stakers, ...delegateesNotStaked.map(id => ({ id, totalVotesAllBD: BigDecimal.ZERO }))]
      .map(({ id, totalVotesAllBD }) => ({
        id,
        votes: totalVotesAllBD.simple ?? 0,
        share: totalVotingToken ? ((totalVotesAllBD.simple ?? 0) / totalVotingToken) * 100 : 0,
      }))
      .slice(0, count)
  }, [leaderboardQuery, stakingQuery, delegateesAll, count])

  const buttonTitle = delegation ? 'Delegate' : 'View profile'
  const cellWidths = delegation ? [70, 30] : [33, 33, 33]
  const tableWidth = delegation ? 16 : 32
  const headerTitles = delegation
    ? [{ title: 'Rank' }, { title: 'Voting Power' }]
    : [{ title: 'Rank' }, { title: 'Voting Power %' }, { title: 'Voting Power' }]

  return (
    <StyledTable headerTitles={headerTitles} widths={cellWidths} width={tableWidth}>
      {leaderboardItems.map(({ id, votes, share }, index) => (
        <TableRow key={id} buttonTitle={buttonTitle} onClick={() => onClick(id)}>
          <DelegateCell width={cellWidths[0]} address={id} delegatee={delegateesAll[id]} rank={(index ?? 0) + 1 + skip} />
          {!delegation && <NumericCell width={cellWidths[1]}>{share.toFixed(2)}%</NumericCell>}
          <NumericCell width={cellWidths[cellWidths.length - 1]}>{votes.toFixed(2)}</NumericCell>
        </TableRow>
      ))}
      <ViewLeaderboardRow>
        {preview ? (
          <TableCell width={100}>
            <Link to="/vote/leaderboard">View Leaderboard</Link>
          </TableCell>
        ) : (
          <NavigationCell>
            <UnstyledButton onClick={() => setSkip(skip - count <= 0 ? 0 : skip - count)}>
              <BackArrow />
            </UnstyledButton>
            <span>{Math.floor(skip / count) + 1}</span>
            <UnstyledButton onClick={() => setSkip(skip + count)}>
              <ForwardArrow />
            </UnstyledButton>
          </NavigationCell>
        )}
      </ViewLeaderboardRow>
    </StyledTable>
  )
}
