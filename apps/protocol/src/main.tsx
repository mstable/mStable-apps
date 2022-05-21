import { composedComponent } from '@apps/react-utils'
import * as ReactDOM from 'react-dom'

import { BaseLayout, BaseProviders } from '@apps/base'
import { DataProvider } from '@apps/data-provider'
import { MassetProvider } from '@apps/masset-provider'
import { ThemeProvider } from '@apps/theme'
import { BrowserSettingsProvider } from '@apps/browser-settings'

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
