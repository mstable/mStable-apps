import * as ReactDOM from 'react-dom'

import { Base } from '@apps/base'

import { ExampleApp } from './app'

ReactDOM.render(
  <Base>
    <ExampleApp />
  </Base>,
  document.getElementById('root'),
)
