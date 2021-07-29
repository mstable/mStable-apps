import * as ReactDOM from 'react-dom'

import { Base } from '@apps/base'
import { DataProvider } from '@apps/data-provider'
import { MassetProvider } from '@apps/masset-provider'

import { ProtocolApp } from './app'

ReactDOM.render(
  <Base>
    <DataProvider>
      <MassetProvider>
        <ProtocolApp />
      </MassetProvider>
    </DataProvider>
  </Base>,
  document.getElementById('root'),
)
