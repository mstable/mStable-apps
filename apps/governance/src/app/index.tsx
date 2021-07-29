import React, { FC, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'

import { useBaseCtx } from '@apps/base'

import { Home } from './pages'
import { Foo } from './pages/foo'

const GovernanceRoutes: FC = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/foo" component={Foo} />
      <Route component={Home} />
    </Switch>
  )
}

export const GovernanceApp: FC = () => {
  const [, setBaseCtx] = useBaseCtx()

  useEffect(() => {
    const navItems = [
      { title: 'Example', path: '/' },
      { title: 'Foo', path: '/foo' },
    ]

    setBaseCtx({ navItems })
  }, [setBaseCtx])

  return <GovernanceRoutes />
}
