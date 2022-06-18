import { Networks } from '@apps/base/context/network'

import type { DialMetadata } from './types'

export const DIALS_METADATA: { [dialId: number]: DialMetadata } = Object.freeze({
  0: {
    network: Networks.Ethereum,
    title: 'Staking MTA',
    color: '#087E8B',
    description:
      'Voting for this dial will direct MTA emissions to staking rewards for MTA governors who staked MTA tokens. Please note the amount of rewards that can go to stakers has a hard cap on it to ensure governors incentivise other parts of the mStable ecosystem. 10% of all system revenue will be directed toward stakers.',
    link: 'https://staking.mstable.org/#/stake',
    linkTitle: 'Stake MTA',
  },
  1: {
    network: Networks.Ethereum,
    title: 'Staking mBPT',
    color: '#48284A',
    description:
      'Voting for this dial will direct MTA emissions to staking rewards for MTA governors who staked 80/20 MTA/WETH Balancer Pool Tokens. Please note the amount of rewards that can go to stakers has a hard cap on it to ensure governors incentivise other parts of the mStable ecosystem. 10% of all system revenue will be directed toward stakers.',
    link: 'https://staking.mstable.org/#/stake',
    linkTitle: 'Stake mBPT',
  },
  2: {
    network: Networks.Ethereum,
    title: 'imUSD Vault',
    color: '#a1cda8',
    description: 'Voting for this dial will direct MTA emissions to rewarding savers who have deposited their imUSD in the Save vault.',
    link: 'https://app.mstable.org/#/musd/save',
    linkTitle: 'Save (mUSD)',
  },
  3: {
    network: Networks.Ethereum,
    title: 'imBTC Vault',
    color: '#ff5a5f',
    description: 'Voting for this dial will direct MTA emissions to rewarding savers who have deposited their imBTC in the Save vault.',
    link: 'https://app.mstable.org/#/mbtc/save',
    linkTitle: 'Save (mBTC)',
  },
  4: {
    network: Networks.Ethereum,
    title: 'GUSD fPool',
    color: '#3c3c3c',
    description: 'Voting for this dial will direct MTA emissions to the GUSD/mUSD feeder pool.',
    link: 'https://app.mstable.org/#/musd/pools/0x4fb30c5a3ac8e85bc32785518633303c4590752d',
    linkTitle: 'Pool',
  },
  5: {
    network: Networks.Ethereum,
    title: 'BUSD fPool',
    color: '#F2F3AE',
    description: 'Voting for this dial will direct MTA emissions to the BUSD/mUSD feeder pool.',
    link: 'https://app.mstable.org/#/musd/pools/0xfe842e95f8911dcc21c943a1daa4bd641a1381c6',
    linkTitle: 'Pool',
  },
  6: {
    network: Networks.Ethereum,
    title: 'alUSD fPool',
    color: '#A3320B',
    description: 'Voting for this dial will direct MTA emissions to the alUSD/mUSD feeder pool.',
    link: 'https://app.mstable.org/#/musd/pools/0x4eaa01974b6594c0ee62ffd7fee56cf11e6af936',
    linkTitle: 'Pool',
  },
  7: {
    network: Networks.Ethereum,
    title: 'RAI fPool',
    color: '#C1839F',
    description: 'Voting for this dial will direct MTA emissions to the RAI/mUSD feeder pool.',
    link: 'https://app.mstable.org/#/musd/pools/0x36f944b7312eac89381bd78326df9c84691d8a5b',
    linkTitle: 'Pool',
  },
  8: {
    network: Networks.Ethereum,
    title: 'FEI fPool',
    color: '#cb4dd2',
    description: 'Voting for this dial will direct MTA emissions to the FEI/mUSD feeder pool.',
    // link: 'https://app.mstable.org/#/musd/pools/0x2f1423d27f9b20058d9d1843e342726fdf985eb4',
    linkTitle: 'Pool',
  },
  9: {
    network: Networks.Ethereum,
    title: 'HBTC fPool',
    color: '#57c0b7',
    description: 'Voting for this dial will direct MTA emissions to the HBTC/mBTC feeder pool.',
    link: 'https://app.mstable.org/#/mbtc/pools/0x48c59199da51b7e30ea200a74ea07974e62c4ba7',
    linkTitle: 'Pool',
  },
  10: {
    network: Networks.Ethereum,
    title: 'tBTC fPool (v2)',
    color: '#40777c',
    description: 'Voting for this dial will direct MTA emissions to the tBTC/mBTC feeder pool.',
    link: 'https://app.mstable.org/#/mbtc/pools/0xc3280306b6218031e61752d060b091278d45c329',
    linkTitle: 'Pool',
  },
  11: {
    network: Networks.Polygon,
    title: 'imUSD Vault',
    color: '#c29e80',
    description:
      'Voting for this dial will direct MTA emissions to rewarding savers who have deposited their imUSD in the Save vault on Polygon.',
    link: 'https://app.mstable.org/#/musd/save?network=polygon',
    linkTitle: 'Save (mUSD)',
  },
  12: {
    network: Networks.Polygon,
    title: 'FRAX fPool',
    color: '#b7e21a',
    description: 'Voting for this dial will direct MTA emissions to the FRAX/mUSD feeder pool on Polygon.',
    link: 'https://app.mstable.org/#/musd/pools/0xb30a907084ac8a0d25dddab4e364827406fd09f0?network=polygon',
    linkTitle: 'Pool',
  },
  13: {
    network: Networks.Polygon,
    title: 'MTA BPT',
    color: '#08392c',
    description:
      'Voting for this dial will direct MTA emissions to reward those who have contributed liquidity to the MTA/WMATIC/WETH Balancer pool on Polygon.',
    link: 'https://polygon.balancer.fi/#/pool/0x614b5038611729ed49e0ded154d8a5d3af9d1d9e00010000000000000000001d',
    linkTitle: 'Balancer Pool',
  },
  14: {
    network: Networks.Ethereum,
    title: 'TreasuryDAO',
    color: '#5800ff',
    description:
      'Voting for this dial will direct MTA emissions back to the mStable TreasuryDAO. This effectively "reallocates" the tokens back to the protocol.',
  },
  15: {
    network: Networks.Ethereum,
    title: 'Votium Bribe',
    color: '#2b8e39',
    description: 'Voting for this dial will direct MTA emissions to incentivising bribing of mUSD liquidity on Curve via its gauges.',
    link: 'https://votium.app/',
    linkTitle: 'Votium',
  },
  16: {
    network: Networks.Ethereum,
    title: 'Visor',
    color: '#4b9fff',
    description:
      'Voting for this dial will direct MTA emissions to the MTA/ETH LP position on Uniswap v3 that is being actively managed by Visor.finance.',
    link: 'https://www.visor.finance/',
    linkTitle: 'Visor Finance',
  },
  17: {
    network: Networks.Ethereum,
    title: 'Vesper',
    color: '#d6d9f2',
    description: `Voting for this dial will direct MTA emissions to Vesper's vaMUSD pool, which aims to increase the utility of mUSD and improve the user experience for accessing yield opportunities. Vesper is also supporting this pool with VSP rewards.`,
    link: 'https://vesper.finance/',
    linkTitle: 'Vesper Finance',
  },
  18: {
    network: Networks.Ethereum,
    title: 'Idle Finance',
    color: '#0667d8',
    description: `Voting for this dial will direct MTA emissions to Idle Finance's Convex MUSD3CRV Senior Tranche, which aims to increase the utility of mUSD and to increase the liquidity of mUSDcrv Curve pool through Idle Finance.`,
    link: 'https://idle.finance/#/dashboard/tranches/senior/convex/MUSD3CRV',
    linkTitle: 'Idle Finance',
  },
})

export const ALL_POSSIBLE_DIAL_IDS = Array.from({ length: 255 }).map((_, dialId) => dialId)
