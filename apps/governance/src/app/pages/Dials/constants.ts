import { Networks } from '@apps/base/context/network'
import { DialMetadata } from './types'

export const DIALS_METADATA: { [dialId: number]: DialMetadata } = Object.freeze({
  0: { network: Networks.Ethereum, title: 'mStable DAO Treasury', key: 'mStableDaoTreasury' },
  1: { network: Networks.Ethereum, title: 'imUSD Vault', key: 'imUsdVault' },
  2: { network: Networks.Ethereum, title: 'imBTC Vault', key: 'imBtcVault' },
  3: { network: Networks.Ethereum, title: 'Staking MTA', key: 'stakingMta' },
  4: { network: Networks.Ethereum, title: 'Staking mBPT', key: 'stakingMBpt' },
  5: { network: Networks.Ethereum, title: 'alUSD fPool', key: 'alUsdFPool' },
  6: { network: Networks.Ethereum, title: 'bUSD fPool', key: 'bUsdFPool' },
  7: { network: Networks.Ethereum, title: 'gUSD fPool', key: 'gUsdFPool' },
  8: { network: Networks.Ethereum, title: 'hBTC fPool', key: 'hBtcFPool' },
  9: { network: Networks.Ethereum, title: 'tBTC fPool (v2)', key: 'tBtcFPoolv2' },
  11: { network: Networks.Ethereum, title: 'Visor finance', key: 'visorFinance' },
  12: { network: Networks.Polygon, title: 'p-imUSD Vault', key: 'pImUsdVault' },
  13: { network: Networks.Polygon, title: 'p-FRAX fPool', key: 'pFraxFPool' },
  14: { network: Networks.Polygon, title: 'p-Balancer MTA/WETH/Matic pool', key: 'pBalancerMtaWethMaticPool' },
  15: { network: Networks.Ethereum, title: 'RAI fPool', key: 'raiFPool' },
  16: { network: Networks.Ethereum, title: 'FEI fPool', key: 'feiFPool' },
})

export const ALL_POSSIBLE_DIAL_IDS = Array.from({ length: 255 }).map((_, dialId) => dialId)
