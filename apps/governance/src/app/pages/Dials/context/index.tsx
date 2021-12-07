import React, { FC } from 'react'

import { EmissionsContext } from './EmissionsContext'
import { EpochContext } from './EpochContext'
import { UserDialsContext } from './UserDialsContext'
import { ViewOptionsContext } from './ViewOptionsContext'

export const DialsContext: FC = ({ children }) => (
  <ViewOptionsContext>
    <EmissionsContext>
      <EpochContext>
        <UserDialsContext>{children}</UserDialsContext>
      </EpochContext>
    </EmissionsContext>
  </ViewOptionsContext>
)
