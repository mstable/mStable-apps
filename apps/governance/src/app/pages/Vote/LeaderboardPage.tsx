import React, { FC, useLayoutEffect } from 'react'

import { Leaderboard } from './Leaderboard'
import { GovernancePageHeader } from '../../components/GovernancePageHeader'
import { useHistory } from 'react-router-dom'

export const LeaderboardPage: FC = () => {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])
  const history = useHistory()
  const handleRowClick = (id: string) => history.push(`/vote/${id}`)

  return (
    <div>
      <GovernancePageHeader title="Leaderboard" backTo="/vote" backTitle="Vote" />
      <Leaderboard onClick={handleRowClick} />
    </div>
  )
}
