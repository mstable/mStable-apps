/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { useMemo } from 'react'

import { useTokenSubscription } from '@apps/base/context/tokens'
import { EthereumMainnet, useNetworkAddresses } from '@apps/base/context/network'
import { BigDecimal } from '@apps/bigdecimal'

export const useVMTABalance = (): BigDecimal => {
  const networkAddresses = useNetworkAddresses() as EthereumMainnet['addresses']
  const stkMTA = useTokenSubscription(networkAddresses.ERC20.stkMTA)
  const stkBPT = useTokenSubscription(networkAddresses.ERC20.stkBPT)

  const balance = useMemo<BigDecimal | undefined>(() => {
    return stkMTA?.balance?.add(stkBPT?.balance ?? BigDecimal.ZERO)?.divPrecisely(new BigDecimal((12e18).toString()))
  }, [stkBPT?.balance, stkMTA?.balance])

  return balance ?? BigDecimal.ZERO
}
