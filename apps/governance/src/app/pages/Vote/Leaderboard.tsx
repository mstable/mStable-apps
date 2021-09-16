import { BigDecimal } from '@apps/bigdecimal'
import React, { FC, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { DelegateeInfo } from '@mstable/delegatee-lists'

import { truncateAddress } from '@apps/formatters'
import { useLeaderboardQuery } from '@apps/artifacts/graphql/staking'
import { useApolloClients } from '@apps/base/context/apollo'
import { IPFSImg, Table, TableCell, TableRow, UnstyledButton, UserIcon } from '@apps/components/core'

import { useDelegateesAll } from '../../context/DelegateeListsProvider'

interface Props {
  preview?: boolean
  delegation?: boolean
  onClick: (id: string) => void
}

const BackArrow: FC = () => (
  <svg width="17" height="8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M.646 3.646a.5.5 0 000 .708l3.182 3.182a.5.5 0 00.708-.708L1.707 4l2.829-2.828a.5.5 0 10-.708-.708L.646 3.646zM17 3.5H1v1h16v-1z"
      fill="#000"
    />
  </svg>
)

const ForwardArrow: FC = () => (
  <svg width="17" height="8" viewBox="0 0 17 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16.3536 4.35355C16.5488 4.15829 16.5488 3.84171 16.3536 3.64645L13.1716 0.464466C12.9763 0.269204 12.6597 0.269204 12.4645 0.464466C12.2692 0.659728 12.2692 0.976311 12.4645 1.17157L15.2929 4L12.4645 6.82843C12.2692 7.02369 12.2692 7.34027 12.4645 7.53553C12.6597 7.7308 12.9763 7.7308 13.1716 7.53553L16.3536 4.35355ZM0 4.5H16V3.5H0L0 4.5Z"
      fill="#000"
    />
  </svg>
)

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

const DisplayName = styled.div<{ isTitleAddress: boolean }>`
  ${({ isTitleAddress, theme }) => isTitleAddress && theme.mixins.numeric};
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

const DelegateeCell: FC<{ address: string; rank: number; delegatee?: DelegateeInfo; width: number }> = ({
  address,
  delegatee,
  rank,
  width,
}) => (
  <StyledDelegateeCell width={width}>
    <div>
      <span>{rank}</span>
    </div>
    <div className="avatar">{delegatee ? <IPFSImg uri={delegatee.avatarURI} /> : <UserIcon address={address} />}</div>
    <DisplayName isTitleAddress={!delegatee?.displayName}>{delegatee?.displayName ?? truncateAddress(address)}</DisplayName>
  </StyledDelegateeCell>
)

export const Leaderboard: FC<Props> = ({ preview, delegation, onClick }) => {
  const [count] = useState<number>(preview ? 5 : 25)
  const [skip, setSkip] = useState<number>(0)

  const delegateesAll = useDelegateesAll()
  const { staking: client } = useApolloClients()

  const leaderboardQuery = useLeaderboardQuery({ client, variables: { count, skip } })

  const leaderboardItems = useMemo<{ id: string; votes: number; share: number }[]>(() => {
    // TODO could do this on subgraph
    const totalVotingToken =
      leaderboardQuery.data?.stakedTokens.reduce((_total, st) => st.token.totalSupply.bigDecimal.simple + _total, 0) ?? 0

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
  }, [leaderboardQuery.data, delegateesAll, count])

  const buttonTitle = delegation ? 'Delegate' : 'View profile'
  const cellWidths = delegation ? [70, 30] : [33, 33, 33]
  const tableWidth = delegation ? 16 : 32
  const headerTitles = delegation
    ? [{ title: 'Rank' }, { title: 'stkMTA' }]
    : [{ title: 'Rank' }, { title: 'stkMTA %' }, { title: 'stkMTA' }]

  return (
    <StyledTable headerTitles={headerTitles} widths={cellWidths} width={tableWidth}>
      {leaderboardItems.map(({ id, votes, share }, index) => (
        <TableRow key={id} buttonTitle={buttonTitle} onClick={() => onClick(id)}>
          <DelegateeCell width={cellWidths[0]} address={id} delegatee={delegateesAll[id]} rank={(index ?? 0) + 1 + skip} />
          {!delegation && <NumericCell width={cellWidths[1]}>{share.toFixed(2)}%</NumericCell>}
          <NumericCell width={cellWidths[cellWidths.length - 1]}>{votes.toFixed(2)}</NumericCell>
        </TableRow>
      ))}
      {preview && (
        <ViewLeaderboardRow>
          <TableCell width={100}>
            <Link to="/vote/leaderboard">View Leaderboard</Link>
          </TableCell>
        </ViewLeaderboardRow>
      )}
      {!preview && (
        <ViewLeaderboardRow>
          <NavigationCell>
            <UnstyledButton onClick={() => setSkip(skip - count <= 0 ? 0 : skip - count)}>
              <BackArrow />
            </UnstyledButton>
            <span>{Math.floor(skip / count) + 1}</span>
            <UnstyledButton onClick={() => setSkip(skip + count)}>
              <ForwardArrow />
            </UnstyledButton>
          </NavigationCell>
        </ViewLeaderboardRow>
      )}
    </StyledTable>
  )
}
