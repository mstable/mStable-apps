import * as ReactDOM from 'react-dom'

import { composedComponent } from '@apps/react-utils'
import { BaseLayout, BaseProviders } from '@apps/base'

import { GovernanceApp } from './app'
import { StakedTokenProvider } from './app/context/StakedTokenProvider'
import { StakingProvider } from './app/context/StakingProvider'
import { DelegateeListsProvider } from './app/context/DelegateeListsProvider'

const Providers = composedComponent(BaseProviders, StakingProvider, StakedTokenProvider, DelegateeListsProvider)

ReactDOM.render(
  <Providers>
    <BaseLayout>
      <GovernanceApp />
    </BaseLayout>
  </Providers>,
  document.getElementById('root'),
)
