import { FC, Reducer, useEffect } from 'react'
import { createReducerContext } from 'react-use'

import { createToggleContext } from '@apps/context-utils'

import { UserDialPreferences } from '../types'
import { useEmissionsData } from './EmissionsContext'

type UserDialsPreferencesAction =
  | {
      type: 'SET_DIAL'
      payload: { dialId: number; value: number }
    }
  | {
      type: 'CURRENT'
      payload: UserDialPreferences
    }
  | { type: 'RESET' }

const [useSystemView, SystemViewProvider] = createToggleContext(true)

const userDialPreferencesReducer: Reducer<{ current: UserDialPreferences; changes: UserDialPreferences }, UserDialsPreferencesAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case 'RESET':
      return { ...state, changes: state.current }
    case 'SET_DIAL':
      return { ...state, changes: { ...state.changes, [action.payload.dialId]: action.payload.value } }
    case 'CURRENT':
      return { ...state, current: action.payload }
    default:
      return state
  }
}

const [useUserDialPreferences, UserDialPreferencesProvider] = createReducerContext(userDialPreferencesReducer, { current: {}, changes: {} })

const UserDialPreferencesUpdater: FC = () => {
  const [emissionsData] = useEmissionsData()
  const [, dispatchUserDialPreferences] = useUserDialPreferences()

  useEffect(() => {
    let payload = {}

    if (emissionsData?.user?.dialPreferences) {
      payload = emissionsData.user.dialPreferences
    }

    dispatchUserDialPreferences({ type: 'CURRENT', payload })
  }, [emissionsData, dispatchUserDialPreferences])

  return null
}

const UserDialsContext: FC = ({ children }) => {
  return (
    <SystemViewProvider>
      <UserDialPreferencesProvider>
        {children}
        <UserDialPreferencesUpdater />
      </UserDialPreferencesProvider>
    </SystemViewProvider>
  )
}

export { UserDialsContext, useSystemView, useUserDialPreferences }
