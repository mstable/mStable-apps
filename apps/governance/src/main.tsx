import * as ReactDOM from 'react-dom'

import { BaseLayout, BaseProviders } from '@apps/base'
import { BrowserSettingsProvider } from '@apps/browser-settings'
import { composedComponent } from '@apps/react-utils'
import { ThemeProvider } from '@apps/theme'

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
