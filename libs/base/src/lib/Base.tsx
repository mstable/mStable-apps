import React, { FC } from 'react'
import { HashRouter } from 'react-router-dom'

import { Providers } from './context'
import { Updaters } from './updaters'
import { Layout } from './components/layout/Layout'

export { BannerMessage } from './components/layout/BannerMessage'

export const Base: FC = ({ children }) => {
  return (
    <HashRouter>
      <Providers>
        <Updaters />
        <Layout>{children}</Layout>
      </Providers>
    </HashRouter>
  )
}
