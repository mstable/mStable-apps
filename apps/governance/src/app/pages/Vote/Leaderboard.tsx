import React, { FC, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { DelegateeInfo } from '@mstable/delegatee-lists'

import { truncateAddress } from '@apps/formatters'
import { useLeaderboardQuery } from '@apps/artifacts/graphql/staking'
import { useApolloClients } from '@apps/base/context/apollo'
import { Table, TableCell, TableRow } from '@apps/components/core'

import { useDelegatesAll } from '../../context/DelegateeListsProvider'

const headerTitles = [{ title: 'Rank' }, { title: 'vMTA %' }, { title: 'vMTA' }]

const StyledTable = styled(Table)``

const ViewLeaderboardRow = styled(TableRow)`
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
  > div {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .avatar {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      overflow: hidden;
      background-color: blueviolet;
      img {
        width: 100%;
        height: auto;
      }
    }

    > :last-child {
      font-weight: 600;
    }
  }
`

// TODO move to core
const IPFSImg: FC<{ uri: string; alt?: string }> = ({ uri, alt }) => {
  const url = uri.startsWith('ipfs://') ? `https://cloudflare-ipfs.com/ipfs/${uri.slice(7)}` : uri
  return <img src={url} alt={alt as string} />
}

const DelegateeCell: FC<{ address: string; rank: number; delegatee?: DelegateeInfo }> = ({ address, delegatee, rank }) => (
  <StyledDelegateeCell>
    <div>{rank}</div>
    <div className="avatar">{delegatee && <IPFSImg uri={delegatee.avatarURI} />}</div>
    <div>{delegatee?.displayName ?? truncateAddress(address)}</div>
  </StyledDelegateeCell>
)

export const Leaderboard: FC<{ preview?: boolean }> = ({ preview }) => {
  const [count, setCount] = useState<number>(preview ? 4 : 25)
  const [skip, setSkip] = useState<number>(0)

  const delegatesAll = useDelegatesAll()
  const clients = useApolloClients()

  const leaderboardQuery = useLeaderboardQuery({ client: clients.staking, variables: { count, skip } })

  const totalVotingToken = useMemo<number>(
    () => leaderboardQuery.data?.stakedTokens.reduce((_total, st) => st.token.totalSupply.bigDecimal.simple + _total, 0) ?? 0,
    [leaderboardQuery.data],
  )

  return (
    <StyledTable headerTitles={headerTitles}>
      {leaderboardQuery.data?.accounts.map(({ totalVotesBD, id }, index) => (
        <TableRow key={id}>
          <DelegateeCell address={id} delegatee={delegatesAll[id]} rank={index + 1} />
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
