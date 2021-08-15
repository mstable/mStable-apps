import React, { FC, useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import { useBaseCtx } from '@apps/base'

import { Stake } from './pages/Stake'
import { Quests } from './pages/Quests'
import { Vote } from './pages/Vote'
import { LeaderboardPage } from './pages/Vote/LeaderboardPage'
import { Delegatee } from './pages/Vote/Delegatee'
import { Stats } from './pages/Stats'
import { NotFound } from './pages/NotFound'

const GovernanceRoutes: FC = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/stake" />
      <Route exact path="/stake" component={Stake} />
      <Route exact path="/vote" component={Vote} />
      <Route exact path="/vote/leaderboard" component={LeaderboardPage} />
      <Route exact path="/vote/:delegatee" component={Delegatee} />
      <Route exact path="/quests" component={Quests} />
      <Route exact path="/stats" component={Stats} />
      <Route component={NotFound} />
    </Switch>
  )
}

export const GovernanceApp: FC = () => {
  const [, setBaseCtx] = useBaseCtx()

  useEffect(() => {
    const navItems = [
      { title: 'Stake', path: '/stake' },
      { title: 'Vote', path: '/vote' },
      { title: 'Quests', path: '/quests' },
      { title: 'Stats', path: '/stats' },
    ]

    setBaseCtx({ navItems })
  }, [setBaseCtx])

  return <GovernanceRoutes />
}
