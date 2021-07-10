import { BigNumber } from 'ethers'

export const SCALE = BigNumber.from((1e18).toString())
export const RATIO_SCALE = BigNumber.from((1e8).toString())

export const DEAD_ADDRESS = '0x0000000000000000000000000000000000000001'

export const MASSETS = {
  musd: {
    name: 'mStable USD',
    symbol: 'mUSD',
    slug: 'musd',
  },
  mbtc: {
    name: 'mStable BTC',
    symbol: 'mBTC',
    slug: 'mbtc',
  },
}
