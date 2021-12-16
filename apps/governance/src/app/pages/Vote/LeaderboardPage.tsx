import React, { FC, useCallback, useLayoutEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { Leaderboard } from './Leaderboard'
import { GovernancePageHeader } from '../../components/GovernancePageHeader'

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
