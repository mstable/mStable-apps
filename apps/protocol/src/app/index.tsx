import React, { FC, useEffect } from 'react'
import { Route, Switch, Redirect, useHistory } from 'react-router-dom'
import { useEffectOnce } from 'react-use'

import { useBaseCtx } from '@apps/base'
import { useNetwork } from '@apps/base/context/network'
import { useSelectedMasset } from '@apps/base/context/masset'
import { useSelectedMassetState } from '@apps/base/context/data'

import { RewardStreamsProvider } from './context/RewardStreamsProvider'
import { SelectedSaveVersionProvider } from './context/SelectedSaveVersionProvider'

import { Save } from './pages/Save'
import { NotFound } from './pages/NotFound'
import { Stats } from './pages/Stats'
import { EarnRedirect } from './pages/EarnRedirect'
import { Pools } from './pages/Pools'
import { PoolDetail } from './pages/Pools/Detail'
import { Forge } from './pages/Forge'

const ProtocolRoutes: FC = () => {
  const { supportedMassets } = useNetwork()
  const [massetName] = useSelectedMasset()
  const history = useHistory()

  useEffectOnce(() => {
    // Redirect for legacy links (without hash)
    if (window.location.pathname !== '/' && !window.location.pathname.startsWith('/ipfs/')) {
      window.location.hash = window.location.pathname
      window.location.pathname = ''
    }

    if (supportedMassets.includes(massetName)) return

    // Redirect if not supported masset
    const tab = window.location.hash.split('/')?.[2]
    if (tab) history.push(`/musd/${tab}`)
  })

  return (
    <Switch>
      <Route exact path="/:massetName/earn" component={EarnRedirect} />
      <Route exact path="/:massetName/earn/admin" component={EarnRedirect} />
      <Route exact path="/:massetName/earn/:slugOrAddress" component={EarnRedirect} />
      <Route exact path="/:massetName/earn/:slugOrAddress/:userAddress" component={EarnRedirect} />
      <Route exact path="/:massetName/stats" component={Stats} />
      <Route exact path="/:massetName/save" component={Save} />
      <Route exact path="/:massetName/pools" component={Pools} />
      <Route exact path="/:massetName/forge/:action" component={Forge} />
      <Route exact path="/:massetName/pools/:poolAddress" component={PoolDetail} />
      <Redirect exact path="/" to="/musd/save" />
      <Redirect exact path="/analytics" to="/musd/stats" />
      <Redirect exact path="/save" to="/musd/save" />
      <Redirect exact path="/earn" to="/musd/earn" />
      <Redirect exact path="/mint" to="/musd/forge/mint" />
      <Redirect exact path="/redeem" to="/musd/forge/redeem" />
      <Redirect exact path="/swap" to="/musd/forge/swap" />
      <Redirect exact path="/musd" to="/musd/forge/mint" />
      <Redirect exact path="/mbtc" to="/mbtc/forge/mint" />
      <Redirect exact path="/musd/swap" to="/musd/forge/swap" />
      <Redirect exact path="/musd/forge" to="/musd/forge/mint" />
      <Redirect exact path="/mbtc/forge" to="/mbtc/forge/mint" />
      <Redirect exact path="/musd/analytics" to="/musd/stats" />
      <Redirect exact path="/mbtc/analytics" to="/mbtc/stats" />
      <Route component={NotFound} />
    </Switch>
  )
}

export const ProtocolApp: FC = () => {
  const massetState = useSelectedMassetState()
  const hasFeederPools = massetState?.hasFeederPools

  const [, setBaseCtx] = useBaseCtx()

  useEffect(() => {
    const navItems = [
      { title: 'Save', path: '/save' },
      ...(hasFeederPools ? [{ title: 'Pools', path: '/pools' }] : []),
      { title: 'Forge', path: '/forge/mint' },
      { title: 'Stats', path: '/stats' },
    ]

    setBaseCtx({ navItems })
  }, [hasFeederPools, setBaseCtx])

  return (
    <SelectedSaveVersionProvider>
      <RewardStreamsProvider>
        <ProtocolRoutes />
      </RewardStreamsProvider>
    </SelectedSaveVersionProvider>
  )
}
