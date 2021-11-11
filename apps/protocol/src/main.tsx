import * as ReactDOM from 'react-dom'

import { BaseLayout, BaseProviders } from '@apps/base'
import { DataProvider } from '@apps/data-provider'
import { MassetProvider } from '@apps/masset-provider'

import { ProtocolApp } from './app'

ReactDOM.render(
  <BaseProviders>
    <DataProvider>
      <MassetProvider>
        <BaseLayout>
          <ProtocolApp />
        </BaseLayout>
      </MassetProvider>
    </DataProvider>
  </BaseProviders>,
  document.getElementById('root'),
)
