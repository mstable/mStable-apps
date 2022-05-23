import { useCallback, useLayoutEffect } from 'react'

import { useHistory } from 'react-router-dom'

import { GovernancePageHeader } from '../../components/GovernancePageHeader'
import { Leaderboard } from './Leaderboard'

import type { FC } from 'react'

export const LeaderboardPage: FC = () => {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])
  const history = useHistory()
  const handleRowClick = useCallback(
    (id: string) => {
      history.push(`/vote/${id}`)
    },
    [history],
  )

  return (
    <div>
      <GovernancePageHeader title="Leaderboard" backTo="/vote" backTitle="Vote" />
      <Leaderboard onClick={handleRowClick} />
    </div>
  )
}
