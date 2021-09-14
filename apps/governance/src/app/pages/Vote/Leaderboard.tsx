import React, { FC, useMemo, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { DelegateeInfo } from '@mstable/delegatee-lists'

import { truncateAddress } from '@apps/formatters'
import { useLeaderboardQuery } from '@apps/artifacts/graphql/staking'
import { useApolloClients } from '@apps/base/context/apollo'
import { IPFSImg, Table, TableCell, TableRow, UserIcon } from '@apps/components/core'

import { useDelegateesAll } from '../../context/DelegateeListsProvider'

const headerTitles = [{ title: 'Rank' }, { title: 'vMTA %' }, { title: 'vMTA' }]

const StyledTable = styled(Table)`
  margin-top: 0.5rem;

  tr:hover > td:nth-last-child(2) {
    display: flex !important;
  }
  tr > td:last-of-type {
    display: none !important;
  }
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

const NumericCell = styled(TableCell)`
  font-family: 'DM Mono', monospace !important;
  text-align: right;
`

const StyledDelegateeCell = styled(TableCell)`
  span {
    ${({ theme }) => theme.mixins.numeric};
  }

  .avatar {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    margin-right: 1rem;
    background: red;
    overflow: hidden;
    background-color: blueviolet;
    img {
      width: 100%;
      height: auto;
    }
  }

  > div {
    display: flex;
    align-items: center;
    gap: 1rem;

    &:first-child {
      margin-right: 1rem;
    }
  }
`

const DelegateeCell: FC<{ address: string; rank: number; delegatee?: DelegateeInfo }> = ({ address, delegatee, rank }) => (
  <StyledDelegateeCell width={30}>
    <div>
      <span>{rank}</span>
    </div>
    <div className="avatar">{delegatee ? <IPFSImg uri={delegatee.avatarURI} /> : <UserIcon address={address} />}</div>
    <div>{delegatee?.displayName ?? truncateAddress(address)}</div>
  </StyledDelegateeCell>
)

export const Leaderboard: FC<{ preview?: boolean }> = ({ preview }) => {
  const [count, setCount] = useState<number>(preview ? 4 : 25)
  const [skip, setSkip] = useState<number>(0)

  const delegatesAll = useDelegateesAll()
  const clients = useApolloClients()
  const history = useHistory()

  const leaderboardQuery = useLeaderboardQuery({ client: clients.staking, variables: { count, skip } })

  const totalVotingToken = useMemo<number>(
    () => leaderboardQuery.data?.stakedTokens.reduce((_total, st) => st.token.totalSupply.bigDecimal.simple + _total, 0) ?? 0,
    [leaderboardQuery.data],
  )

  return (
    <StyledTable headerTitles={headerTitles} widths={[30, 30, 30]} width={32}>
      {leaderboardQuery.data?.accounts.map(({ totalVotesBD, id }, index) => (
        <TableRow
          key={id}
          onClick={() => {
            history.push(`/vote/${id}`)
          }}
        >
          <DelegateeCell address={id} delegatee={delegatesAll[id]} rank={(index ?? 0) + 1} />
          <NumericCell>{(totalVotesBD.simple / totalVotingToken).toFixed(2)}%</NumericCell>
          <NumericCell>{totalVotesBD.simple.toFixed(2)}</NumericCell>
        </TableRow>
      ))}
      {preview && (
        <ViewLeaderboardRow>
          <TableCell width={100}>
            <Link to="/vote/leaderboard">View Leaderboard</Link>
          </TableCell>
        </ViewLeaderboardRow>
      )}
    </StyledTable>
  )
}
