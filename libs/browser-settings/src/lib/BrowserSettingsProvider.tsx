import { createReducerContext } from 'react-use'
import { composeRight } from 'ts-pipe-compose'

interface BrowserSettingsState {
  isDarkMode: boolean
  showSubgraphStatus: boolean
}

type BrowserSettingsAction =
  | {
      type: 'TOGGLE_DARK_MODE'
    }
  | { type: 'TOGGLE_SHOW_SUBGRAPH_STATUS' }

const LOCALSTORAGE_KEY = 'browser-settings'

const getInitialState = (): BrowserSettingsState => {
  const fromStorage = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) ?? '{}') as Partial<BrowserSettingsState>
  return { isDarkMode: false, showSubgraphStatus: false, ...fromStorage }
}

const reducer = (state: BrowserSettingsState, action: BrowserSettingsAction) => {
  switch (action.type) {
    case 'TOGGLE_DARK_MODE':
      return { ...state, isDarkMode: !state.isDarkMode }
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

export const useToggleDarkTheme = () => useBrowserSettings()[1].bind(null, { type: 'TOGGLE_DARK_MODE' })
export const useToggleSubgraphStatus = () => useBrowserSettings()[1].bind(null, { type: 'TOGGLE_SHOW_SUBGRAPH_STATUS' })
