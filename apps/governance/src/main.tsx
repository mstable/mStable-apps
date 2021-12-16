import * as ReactDOM from 'react-dom'

import { ThemeProvider } from '@apps/theme'
import { composedComponent } from '@apps/react-utils'
import { BaseLayout, BaseProviders } from '@apps/base'
import { BrowserSettingsProvider } from '@apps/browser-settings'

import { GovernanceApp } from './app'
import { GovernanceContext } from './app/context'

const Providers = composedComponent(BrowserSettingsProvider, ThemeProvider, BaseProviders, GovernanceContext)

ReactDOM.render(
  <Providers>
    <BaseLayout>
      <GovernanceApp />
    </BaseLayout>
  </Providers>,
  document.getElementById('root'),
)
