import React, { FC, useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import { useBaseCtx } from '@apps/base'
import { APP_NAME } from '@apps/types'

import { Stake } from './pages/Stake'
import { Quests } from './pages/Quests'
import { Vote } from './pages/Vote'
import { LeaderboardPage } from './pages/Vote/LeaderboardPage'
import { Delegatee } from './pages/Vote/Delegatee'
import { Stats } from './pages/Stats'
import { Dials } from './pages/Dials'
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
      <Route exact path="/quests/:questId" component={Quests} />
      <Route exact path="/stats" component={Stats} />
      <Route exact path="/dials" component={Dials} />
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
      { title: 'Dials', path: '/dials' },
      { title: 'Stats', path: '/stats' },
    ]
    const appName = APP_NAME.GOVERNANCE

    setBaseCtx({ navItems, appName })
  }, [setBaseCtx])

  return <GovernanceRoutes />
}
