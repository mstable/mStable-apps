import React, { FC, createContext, useContext, useCallback, useMemo, useReducer, Reducer } from 'react'

import { useSound } from '@apps/browser-settings'

// @ts-ignore
import achievement from '@apps/assets/sounds/achievement.mp3'
// @ts-ignore
import rareAchievement from '@apps/assets/sounds/rare-achievement.mp3'

enum Actions {
  Add,
  MarkAsRead,
  HideToast,
}

export enum NotificationType {
  Success,
  Error,
  Info,
  Quest,
}

export interface Notification {
  type: NotificationType
  id: string
  title: string
  body?: string | null
  link?: {
    href: string
    title: string
  } | null
  questPoints?: number
  read?: boolean
  hideToast?: boolean
}

type State = Notification[]

type Action =
  | {
      type: Actions.Add
      payload: Notification
    }
  | { type: Actions.MarkAsRead; payload: string }
  | { type: Actions.HideToast; payload: string }

type AddNotificationCallback = (title: Notification['title'], body?: Notification['body'], link?: Notification['link']) => void

interface Dispatch {
  addErrorNotification: AddNotificationCallback
  addInfoNotification: AddNotificationCallback
  addSuccessNotification: AddNotificationCallback
  addQuestNotification(title: string, questPoints?: number): void
  markNotificationAsRead(id: string): void
}

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.Add: {
      const notification = action.payload
      const existing = state.some(n => n.id === notification.id)
      return existing ? state : [notification, ...state]
    }

    case Actions.MarkAsRead: {
      const id = action.payload
      return state.map(n => (n.id === id ? { ...n, read: true } : n))
    }

    case Actions.HideToast: {
      const id = action.payload
      return state.map(n => (n.id === id ? { ...n, hideToast: true } : n))
    }

    default:
      return state
  }
}

const initialState: State = []

const context = createContext<[State, Dispatch]>([initialState, {} as never])

export const NotificationsProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [playAchievement] = useSound(achievement, { volume: 0.5, interrupt: true })
  const [playRareAchievement] = useSound(rareAchievement, { volume: 0.5 })

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id'>) => {
      const id = Math.random().toString()

      dispatch({
        type: Actions.Add,
        payload: { id, ...notification },
      })

      const isQuest = notification.type === NotificationType.Quest
      if (isQuest) {
        if (notification.questPoints) {
          playAchievement()
        } else {
          playRareAchievement()
        }
      }

      // Hide the notification toast after a delay
      if (!isQuest) {
        setTimeout(() => {
          dispatch({ type: Actions.HideToast, payload: id })
        }, 8e3)
      }
    },
    [playAchievement, playRareAchievement],
  )

  const addErrorNotification = useCallback<Dispatch['addErrorNotification']>(
    (title, body, link) => {
      addNotification({ title, body, link, type: NotificationType.Error })
    },
    [addNotification],
  )

  const addInfoNotification = useCallback<Dispatch['addInfoNotification']>(
    (title, body, link) => {
      addNotification({ title, body, link, type: NotificationType.Info })
    },
    [addNotification],
  )

  const addSuccessNotification = useCallback<Dispatch['addSuccessNotification']>(
    (title, body, link) => {
      addNotification({ title, body, link, type: NotificationType.Success })
    },
    [addNotification],
  )

  const addQuestNotification = useCallback<Dispatch['addQuestNotification']>(
    (title, questPoints) => {
      addNotification({ title, questPoints, type: NotificationType.Quest })
    },
    [addNotification],
  )

  const markNotificationAsRead = useCallback<Dispatch['markNotificationAsRead']>(
    id => {
      dispatch({ type: Actions.MarkAsRead, payload: id })
    },
    [dispatch],
  )

  return (
    <context.Provider
      value={useMemo(
        () => [
          state,
          {
            addErrorNotification,
            addInfoNotification,
            addSuccessNotification,
            addQuestNotification,
            markNotificationAsRead,
          },
        ],
        [state, addErrorNotification, addInfoNotification, addSuccessNotification, addQuestNotification, markNotificationAsRead],
      )}
    >
      {children}
    </context.Provider>
  )
}

export const useNotificationsContext = (): [State, Dispatch] => useContext(context)

export const useNotificationsState = (): State => useNotificationsContext()[0]

export const useUnreadNotifications = (): Notification[] => useNotificationsState().filter(n => !n.read && n.type !== NotificationType.Info)

export const useNotificationsDispatch = (): Dispatch => useNotificationsContext()[1]

export const useAddErrorNotification = (): Dispatch['addErrorNotification'] => useNotificationsDispatch().addErrorNotification

export const useAddInfoNotification = (): Dispatch['addInfoNotification'] => useNotificationsDispatch().addInfoNotification

export const useAddSuccessNotification = (): Dispatch['addSuccessNotification'] => useNotificationsDispatch().addSuccessNotification

export const useAddQuestNotification = (): Dispatch['addQuestNotification'] => useNotificationsDispatch().addQuestNotification

export const useMarkNotificationAsRead = (): Dispatch['markNotificationAsRead'] => useNotificationsDispatch().markNotificationAsRead
