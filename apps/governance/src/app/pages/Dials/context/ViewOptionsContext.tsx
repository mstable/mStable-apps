import { FC } from 'react'
import { createStateContext } from 'react-use'

import { createToggleContext } from '@apps/context-utils'

import { ActiveDial } from '../types'
import { useEmissionsData } from './EmissionsContext'
import { useEpochData } from './EpochContext'

const [useHoveredDialId, HoveredDialIdProvider] = createStateContext<number | undefined>(undefined)
const [useSelectedDialId, SelectedDialIdProvider] = createStateContext<number | undefined>(undefined)

const useHoveredDial = (): ActiveDial | undefined => {
  const [emissionsData] = useEmissionsData()
  const [epochData] = useEpochData()
  const [hoveredDialId] = useHoveredDialId()

  return epochData && emissionsData
    ? {
        dial: emissionsData.dials[hoveredDialId],
        dialVotes: epochData.dialVotes[hoveredDialId],
      }
    : undefined
}

const useActiveDial = (): ActiveDial | undefined => {
  const [emissionsData] = useEmissionsData()
  const [epochData] = useEpochData()
  const [hoveredDialId] = useHoveredDialId()
  const [selectedDialId] = useSelectedDialId()
  const activeDialId = hoveredDialId ?? selectedDialId ?? 0

  return epochData && emissionsData
    ? {
        dial: emissionsData.dials[activeDialId],
        dialVotes: epochData.dialVotes[activeDialId],
      }
    : undefined
}

const [useSystemView, SystemViewProvider] = createToggleContext(true)

const [useShowVotesTable, ShowVotesTableProvider] = createToggleContext(false)

const ViewOptionsContext: FC = ({ children }) => (
  <SystemViewProvider>
    <ShowVotesTableProvider>
      <SelectedDialIdProvider>
        <HoveredDialIdProvider>{children}</HoveredDialIdProvider>
      </SelectedDialIdProvider>
    </ShowVotesTableProvider>
  </SystemViewProvider>
)

export { ViewOptionsContext, useSystemView, useShowVotesTable, useActiveDial, useHoveredDialId, useSelectedDialId, useHoveredDial }
