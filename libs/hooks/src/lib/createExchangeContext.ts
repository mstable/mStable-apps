import { FC, createContext, Context, useState, Dispatch, SetStateAction } from 'react'

import { createUseContextFn, providerFactory } from '@apps/context-utils'

export enum ExchangeAction {
  Default,
  MultiMint,
  MultiRedeem,
}

type State = [ExchangeAction, Dispatch<SetStateAction<ExchangeAction>>]

export const createExchangeContext = (
  defaultInitialValue = ExchangeAction.Default,
): Readonly<[() => State, FC<{ initialValue?: ExchangeAction }>, Context<State>]> => {
  const context = createContext<State>(undefined as never)

  const ExchangeProvider: FC<{ initialValue?: ExchangeAction }> = ({ children, initialValue }) => {
    const state = useState(initialValue !== undefined ? initialValue : defaultInitialValue)
    return providerFactory(context, { value: state }, children)
  }

  return [createUseContextFn(context, true), ExchangeProvider, context] as const
}
