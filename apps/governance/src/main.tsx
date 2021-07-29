import * as ReactDOM from 'react-dom'

import { Base } from '@apps/base'

import { GovernanceApp } from './app'

ReactDOM.render(
  <Base>
    <GovernanceApp />
  </Base>,
  document.getElementById('root'),
)
