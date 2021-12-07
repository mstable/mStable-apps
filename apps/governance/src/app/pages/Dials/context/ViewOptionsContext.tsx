import { FC, useMemo } from 'react'
import { createStateContext } from 'react-use'

import { createToggleContext } from '@apps/context-utils'

import { ActiveDial } from '../types'
import { useEmissionsData } from './EmissionsContext'
import { useEpochData } from './EpochContext'

const [useHoveredDialId, HoveredDialIdProvider] = createStateContext<number | undefined>(undefined)
const [useSelectedDialId, SelectedDialIdProvider] = createStateContext<number | undefined>(undefined)

const useSelectedDial = (): ActiveDial | undefined => {
  const [emissionsData] = useEmissionsData()
  const [epochData] = useEpochData()
  const [selectedDialId] = useSelectedDialId()

  return epochData && emissionsData && typeof selectedDialId == 'number'
    ? {
        dial: emissionsData.dials[selectedDialId],
        dialVotes: epochData.dialVotes[selectedDialId],
      }
    : undefined
}

const useHoveredDial = (): ActiveDial | undefined => {
  const [emissionsData] = useEmissionsData()
  const [epochData] = useEpochData()
  const [hoveredDialId] = useHoveredDialId()

  return epochData && emissionsData && typeof hoveredDialId == 'number'
    ? {
        dial: emissionsData.dials[hoveredDialId],
        dialVotes: epochData.dialVotes[hoveredDialId],
      }
    : undefined
}

const [useSystemView, SystemViewProvider] = createToggleContext(true)

const ViewOptionsContext: FC = ({ children }) => (
  <SystemViewProvider>
    <SelectedDialIdProvider>
      <HoveredDialIdProvider>{children}</HoveredDialIdProvider>
    </SelectedDialIdProvider>
  </SystemViewProvider>
)

export { ViewOptionsContext, useSystemView, useHoveredDialId, useSelectedDialId, useHoveredDial, useSelectedDial }
