import * as ReactDOM from 'react-dom'

import { BaseLayout, BaseProviders } from '@apps/base'
import { BrowserSettingsProvider } from '@apps/browser-settings'
import { DataProvider } from '@apps/data-provider'
import { MassetProvider } from '@apps/masset-provider'
import { composedComponent } from '@apps/react-utils'
import { ThemeProvider } from '@apps/theme'

import { ProtocolApp } from './app'
const ProtocolContext = composedComponent(BrowserSettingsProvider, ThemeProvider, BaseProviders, DataProvider, MassetProvider)

ReactDOM.render(
  <ProtocolContext>
    <BaseLayout>
      <ProtocolApp />
    </BaseLayout>
  </ProtocolContext>,
  document.getElementById('root'),
)
