import * as ReactDOM from 'react-dom'

import { BaseLayout, BaseProviders } from '@apps/base'

import { GovernanceApp } from './app'
import { StakedTokenProvider } from './app/context/StakedTokenProvider'
import { StakingProvider } from './app/context/StakingProvider'

ReactDOM.render(
  <BaseProviders>
    <StakingProvider>
      <StakedTokenProvider>
        <BaseLayout>
          <GovernanceApp />
        </BaseLayout>
      </StakedTokenProvider>
    </StakingProvider>
  </BaseProviders>,
  document.getElementById('root'),
)
