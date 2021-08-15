import * as ReactDOM from 'react-dom'

import { BaseLayout, BaseProviders } from '@apps/base'

import { GovernanceApp } from './app'
import { StakingProvider } from './app/context/StakingProvider'

ReactDOM.render(
  <BaseProviders>
    <StakingProvider>
      <BaseLayout>
        <GovernanceApp />
      </BaseLayout>
    </StakingProvider>
  </BaseProviders>,
  document.getElementById('root'),
)
