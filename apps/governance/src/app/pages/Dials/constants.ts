import { Networks } from '@apps/base/context/network'
import { DialMetadata } from './types'

export const DIALS_METADATA: { [dialId: number]: DialMetadata } = Object.freeze({
  0: { network: Networks.Ethereum, title: 'Staking MTA' },
  1: { network: Networks.Ethereum, title: 'Staking mBPT' },
  2: { network: Networks.Ethereum, title: 'imUSD Vault' },
  3: { network: Networks.Ethereum, title: 'imBTC Vault' },
  4: { network: Networks.Ethereum, title: 'gUSD fPool' },
  5: { network: Networks.Ethereum, title: 'bUSD fPool' },
  6: { network: Networks.Ethereum, title: 'alUSD fPool' },
  7: { network: Networks.Ethereum, title: 'RAI fPool' },
  8: { network: Networks.Ethereum, title: 'FEI fPool' },
  9: { network: Networks.Ethereum, title: 'hBTC fPool' },
  10: { network: Networks.Ethereum, title: 'tBTC fPool (v2)' },
})

export const ALL_POSSIBLE_DIAL_IDS = Array.from({ length: 255 }).map((_, dialId) => dialId)
