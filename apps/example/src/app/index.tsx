import React, { FC, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import { useEffectOnce } from 'react-use'

import { useBaseCtx } from '@apps/base'

import { Home } from './pages'
import { Foo } from './pages/foo'

const ExampleRoutes: FC = () => {
  useEffectOnce(() => {
    // Redirect for legacy links (without hash)
    if (window.location.pathname !== '/' && !window.location.pathname.startsWith('/ipfs/')) {
      window.location.hash = window.location.pathname
      window.location.pathname = ''
    }
  })

  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/foo" component={Foo} />
      <Route component={Home} />
    </Switch>
  )
}

export const ExampleApp: FC = () => {
  const [, setBaseCtx] = useBaseCtx()

  useEffect(() => {
    const navItems = [
      { title: 'Example', path: '/' },
      { title: 'Foo', path: '/foo' },
    ]

    setBaseCtx({ navItems })
  }, [setBaseCtx])

  return <ExampleRoutes />
}
