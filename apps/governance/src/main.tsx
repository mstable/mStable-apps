import * as ReactDOM from 'react-dom'

import { BaseLayout, BaseProviders } from '@apps/base'

import { GovernanceApp } from './app'

ReactDOM.render(
  <BaseProviders>
    <BaseLayout>
      <GovernanceApp />
    </BaseLayout>
  </BaseProviders>,
  document.getElementById('root'),
)
