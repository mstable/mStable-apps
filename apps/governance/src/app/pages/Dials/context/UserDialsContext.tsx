import { useEffect } from 'react'

import { createReducerContext } from 'react-use'

import { useEmissionsData } from './EmissionsContext'

import type { FC, Reducer } from 'react'

import type { UserDialPreferences } from '../types'

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

const userDialPreferencesReducer: Reducer<
  { current: UserDialPreferences; changes: UserDialPreferences; touched: boolean },
  UserDialsPreferencesAction
> = (state, action) => {
  switch (action.type) {
    case 'RESET':
      return { ...state, changes: state.current, touched: false }
    case 'SET_DIAL': {
      const changes = { ...state.changes, [action.payload.dialId]: action.payload.value }
      if (Object.keys(changes).length > 16) return { ...state }
      const touched = !!Object.keys(changes).filter(k => (state.current[k] ?? 0) !== changes[k]).length
      return { ...state, changes, touched }
    }
    case 'CURRENT':
      return { ...state, current: action.payload, changes: state.touched ? state.changes : action.payload }
    default:
      return state
  }
}

const [useUserDialPreferences, UserDialPreferencesProvider] = createReducerContext(userDialPreferencesReducer, {
  current: {},
  changes: {},
  touched: false,
})

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
    <UserDialPreferencesProvider>
      {children}
      <UserDialPreferencesUpdater />
    </UserDialPreferencesProvider>
  )
}

export { UserDialsContext, useUserDialPreferences }
