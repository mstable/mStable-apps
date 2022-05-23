import { createContext, createElement, useContext } from 'react'

import { useToggle } from 'react-use'

import type { Context, FC, ReactElement, ReactNode } from 'react'

export const providerFactory = <T>(context: Context<T>, props: { value: T }, children: ReactNode): ReactElement =>
  createElement(context.Provider, props, children)

export const createUseContextFn =
  <T>(context: Context<T>, checkNull?: boolean) =>
  (): T => {
    const value = useContext(context)

    if (checkNull && value == null) {
      throw new Error(`${context.displayName} must be used inside a ${context.Provider.name}.`)
    }

    return value
  }

type Toggle = [boolean, () => void]

export const createToggleContext = (
  defaultInitialValue = false,
): Readonly<[() => Toggle, FC<{ initialValue?: boolean }>, Context<Toggle>]> => {
  const context = createContext<Toggle>(undefined as never)

  const ToggleProvider: FC<{ initialValue?: boolean }> = ({ children, initialValue }) => {
    const toggle = useToggle(initialValue !== undefined ? initialValue : defaultInitialValue)
    return providerFactory(context, { value: toggle }, children)
  }

  return [createUseContextFn(context, true), ToggleProvider, context] as const
}
