import React, { FC } from 'react'
import { HashRouter } from 'react-router-dom'

import { createStateContext } from 'react-use'

import { Providers } from './context'
import { Updaters } from './updaters'
import { Layout } from './components/layout/Layout'

export { BannerMessage } from './components/layout/BannerMessage'

export const [useBaseCtx, BaseCtxProvider, baseCtx] = createStateContext<{ navItems: { path: string; title: string }[] }>({ navItems: [] })

export const Base: FC = ({ children }) => {
  return (
    <BaseCtxProvider>
      <HashRouter>
        <Providers>
          <Updaters />
          <Layout>{children}</Layout>
        </Providers>
      </HashRouter>
    </BaseCtxProvider>
  )
}
