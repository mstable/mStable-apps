import { createReducerContext } from 'react-use'
import { composeRight } from 'ts-pipe-compose'
import useSoundHook from 'use-sound'
import { SpriteMap } from 'use-sound/dist/types'

type UseSoundHookOptions<T extends {}> = T & {
  id?: string
  volume?: number
  playbackRate?: number
  interrupt?: boolean
  soundEnabled?: boolean
  sprite?: SpriteMap
  onload?: () => void
}

interface BrowserSettingsState {
  isDarkMode: boolean
  mute: boolean
  showSubgraphStatus: boolean
}

type BrowserSettingsAction =
  | {
      type: 'TOGGLE_DARK_MODE'
    }
  | { type: 'TOGGLE_SHOW_SUBGRAPH_STATUS' }
  | {
      type: 'TOGGLE_MUTE'
    }

const LOCALSTORAGE_KEY = 'browser-settings'

const getInitialState = (): BrowserSettingsState => {
  const fromStorage = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) ?? '{}') as Partial<BrowserSettingsState>
  return { mute: false, isDarkMode: false, showSubgraphStatus: false, ...fromStorage }
}

const reducer = (state: BrowserSettingsState, action: BrowserSettingsAction) => {
  switch (action.type) {
    case 'TOGGLE_DARK_MODE':
      return { ...state, isDarkMode: !state.isDarkMode }
    case 'TOGGLE_MUTE':
      return { ...state, mute: !state.mute }
    case 'TOGGLE_SHOW_SUBGRAPH_STATUS':
      return { ...state, showSubgraphStatus: !state.showSubgraphStatus }
    default:
      return state
  }
}

const withLocalStorage = (state: BrowserSettingsState) => {
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(state))
  return state
}

export const [useBrowserSettings, BrowserSettingsProvider] = createReducerContext(
  composeRight(reducer, withLocalStorage),
  getInitialState(),
)

export const useIsDarkMode = () => useBrowserSettings()[0].isDarkMode
export const useShowSubgraphStatus = () => useBrowserSettings()[0].showSubgraphStatus
export const useMute = () => useBrowserSettings()[0].mute

export const useSound = <T extends {}>(
  filename: Parameters<typeof useSoundHook>[0],
  options: UseSoundHookOptions<T> = {} as UseSoundHookOptions<T>,
): ReturnType<typeof useSoundHook> => {
  const mute = useMute()
  return useSoundHook<T>(filename, { ...options, soundEnabled: !mute })
}

export const useToggleDarkTheme = () => useBrowserSettings()[1].bind(null, { type: 'TOGGLE_DARK_MODE' })
export const useToggleSubgraphStatus = () => useBrowserSettings()[1].bind(null, { type: 'TOGGLE_SHOW_SUBGRAPH_STATUS' })
export const useToggleMute = () => useBrowserSettings()[1].bind(null, { type: 'TOGGLE_MUTE' })
