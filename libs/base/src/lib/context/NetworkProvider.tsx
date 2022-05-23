import { createContext, useCallback, useContext, useEffect, useMemo } from 'react'

import { useFetchState } from '@apps/hooks'
import { composedComponent } from '@apps/react-utils'
import { DEAD_ADDRESS } from '@apps/types'
import { providers } from 'ethers'
import { createStateContext, useInterval } from 'react-use'

import type { FetchState, MassetName } from '@apps/types'
import type { Provider } from '@ethersproject/providers'
import type { FC } from 'react'

interface NetworkPrices {
  nativeToken?: number
  gas?: {
    slow: number
    standard: number
    fast: number
    instant: number
  }
}

interface GasPrice {
  standard: number
  fast: number
  slow: number
  instant: number
}

// interface GasWatch {
//   slow: GasWatchPrice
//   normal: GasWatchPrice
//   fast: GasWatchPrice
//   instant: GasWatchPrice
//   ethPrice: number
//   lastUpdated: number
//   sources: GasWatchSource[]
// }

interface MyCryptoGas {
  safeLow: number
  standard: number
  fast: number
  fastest: number
}

// interface GasWatchPrice {
//   gwei: number
//   usd: number
// }

// interface GasWatchSource {
//   name: string
//   source: string
//   fast: number
//   standard: number
//   slow: number
//   lastBlock: number
// }

// interface GasPoaNetwork {
//   health: boolean
//   block_number: number
//   slow: number
//   standard: number
//   fast: number
//   instant: number
//   block_time: number
// }

interface MaticMainGas {
  safeLow: number
  standard: number
  fast: number
  fastest: number
  blockTime: number
  blockNumber: number
}

interface CoreAddresses {
  MTA: string
  vMTA: string
  WBTC?: string
  stkMTA?: string
  stkBPT?: string
  FeederWrapper: string
  SaveWrapper: string
  UniswapRouter02_Like: string
}

type GraphQLEndpoints<T extends string> = Record<T, [string] | [string, string]>

type MstableGqlEndpoints = GraphQLEndpoints<'protocol'>

type CoreGqlEndpoints = MstableGqlEndpoints & GraphQLEndpoints<'blocks'>

export enum ChainIds {
  EthereumMainnet = 1,
  EthereumRopsten = 3,
  EthereumGoerli = 5,
  EthereumKovan = 42,
  MaticMainnet = 137,
  MaticMumbai = 80001,
}

export enum Networks {
  Ethereum = 'Ethereum',
  Polygon = 'Polygon',
}

interface Network<TAddresses, TGqlEndpoints> {
  protocolName: string
  chainName: string
  isMetaMaskDefault: boolean
  isTestnet: boolean
  blockTime: number
  nativeToken: {
    decimals: number
    symbol: string
    parentChainAddress?: string
  }
  chainId: ChainIds
  parentChainId?: ChainIds
  coingeckoId: string
  rpcEndpoints: string[]
  gqlEndpoints: CoreGqlEndpoints & TGqlEndpoints
  addresses: CoreAddresses & { ERC20: { wMATIC?: string; WETH?: string; FXS?: string } } & TAddresses
  gasStationEndpoint: string
  getExplorerUrl: (entity?: string, type?: 'address' | 'transaction' | 'token' | 'account') => string
  supportedMassets: MassetName[]
}

export interface EthereumMainnet
  extends Network<
    {
      ERC20: {
        WETH: string
        stkMTA: string
        stkBPT: string
      }
      MerkleDropMBPTBAL: string
    },
    GraphQLEndpoints<'feeders' | 'snapshot' | 'staking' | 'questbook' | 'merkleDrop' | 'emissions'>
  > {
  chainId: ChainIds.EthereumMainnet
}

export interface EthereumRopsten
  extends Network<{ ERC20: { WETH: string } }, GraphQLEndpoints<'staking' | 'questbook' | 'snapshot' | 'merkleDrop' | 'emissions'>> {
  chainId: ChainIds.EthereumRopsten
}

export interface EthereumKovan
  extends Network<
    { ERC20: { WETH: string }; MerkleDropMBPTBAL: string },
    GraphQLEndpoints<'staking' | 'questbook' | 'snapshot' | 'merkleDrop'>
  > {
  chainId: ChainIds.EthereumKovan
}

export interface EthereumGoerli extends Network<{ ERC20: { WETH: string } }, {}> {
  chainId: ChainIds.EthereumGoerli
}

export interface MaticMainnet
  extends Network<
    {
      ERC20: {
        wMATIC: string
      }
      FRAX: { stakingContract: string; stakingToken: string; rewardsTokens: [string, string]; feederPool: string }
    },
    GraphQLEndpoints<'stakingRewards' | 'feeders'>
  > {
  chainId: ChainIds.MaticMainnet
  parentChainId: ChainIds.EthereumMainnet
  nativeToken: {
    symbol: string
    decimals: number
    parentChainAddress: string
  }
}

export interface MaticMumbai extends Network<{ ERC20: { wMATIC: string } }, CoreGqlEndpoints> {
  chainId: ChainIds.MaticMumbai
  parentChainId: ChainIds.EthereumGoerli
  nativeToken: {
    symbol: string
    decimals: number
    parentChainAddress: string
  }
}

export type AllNetworks = EthereumMainnet | EthereumRopsten | EthereumKovan | EthereumGoerli | MaticMainnet | MaticMumbai

export type AllGqlEndpoints = keyof (EthereumMainnet['gqlEndpoints'] &
  EthereumGoerli['gqlEndpoints'] &
  EthereumRopsten['gqlEndpoints'] &
  EthereumKovan['gqlEndpoints'] &
  MaticMainnet['gqlEndpoints'] &
  MaticMumbai['gqlEndpoints'])

const etherscanUrl =
  (network?: string, domain = 'etherscan.io') =>
  (data?: string, type?: 'account' | 'transaction' | 'address' | 'token'): string => {
    const prefix = `https://${network ? `${network}.` : ''}${domain}`

    if (!data) return prefix

    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      case 'token':
        return `${prefix}/token/${data}`
      case 'address':
      default:
        return `${prefix}/address/${data}`
    }
  }

const graphMainnetEndpoint = (subgraphId: string, version: number, apiKey: string): string =>
  `https://gateway.thegraph.com/api/${apiKey}/subgraphs/id/${subgraphId}-${version}`

const graphHostedEndpoint = (orgName: string, subgraphName: string): string =>
  `https://api.thegraph.com/subgraphs/name/${orgName}/${subgraphName}`

const ETH_MAINNET: EthereumMainnet = {
  chainId: ChainIds.EthereumMainnet,
  protocolName: Networks.Ethereum,
  chainName: 'Mainnet',
  nativeToken: {
    symbol: 'ETH',
    decimals: 18,
  },
  isMetaMaskDefault: true,
  isTestnet: false,
  blockTime: 15e3,
  coingeckoId: 'ethereum',
  rpcEndpoints: ['https://mainnet.infura.io/v3/a6daf77ef0ae4b60af39259e435a40fe'],
  gasStationEndpoint: 'https://gas.mycryptoapi.com/',
  gqlEndpoints: {
    protocol: [
      graphHostedEndpoint('mstable', 'mstable-protocol'),
      graphMainnetEndpoint('0x26cf67040678eb0f5654c9cbaad78dc1694cbafa', 0, process.env.NX_PROTOCOL_SUBGRAPH_API_KEY as string),
    ],
    staking: [graphHostedEndpoint('mstable', 'mstable-staking')],
    questbook: ['https://europe-west1-mstable-questbook.cloudfunctions.net/questbook'],
    merkleDrop: [graphHostedEndpoint('mstable', 'mstable-merkle-drop')],
    snapshot: ['https://hub.snapshot.org/graphql'],
    feeders: [
      // Temporary preview URL because indexers haven't picked up the new version...
      'https://api.studio.thegraph.com/query/27320/mstable-feeder-pools-and-vaults/v0.0.13',
      graphMainnetEndpoint('0x021c1a1ce318e7b4545f6280b248062592b71706', 0, process.env.NX_FEEDERS_SUBGRAPH_API_KEY as string),
    ],
    blocks: [graphHostedEndpoint('blocklytics', 'ethereum-blocks')],
    emissions: [graphHostedEndpoint('mstable', 'mstable-dials')],
  },
  addresses: {
    MTA: '0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2',
    vMTA: '0xae8bc96da4f9a9613c323478be181fdb2aa0e1bf',
    WBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    stkMTA: '0x8f2326316ec696f6d023e37a9931c2b2c177a3d7',
    stkBPT: '0xefbe22085d9f29863cfb77eed16d3cc0d927b011',
    FeederWrapper: '0x7C1fD068CE739A4687BEe9F69e5FD2275C7372d4',
    SaveWrapper: '0x0CA7A25181FC991e3cC62BaC511E62973991f325',
    UniswapRouter02_Like: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    ERC20: {
      WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      FXS: '0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0',
      stkMTA: '0x8f2326316ec696f6d023e37a9931c2b2c177a3d7',
      stkBPT: '0xefbe22085d9f29863cfb77eed16d3cc0d927b011',
    },
    MerkleDropMBPTBAL: '0x783cc67242fd639a7621ea1a1c511e4c64d7c66d',
  },
  getExplorerUrl: etherscanUrl(),
  supportedMassets: ['mbtc', 'musd'],
}

const ETH_ROPSTEN: EthereumRopsten = {
  ...ETH_MAINNET,
  isTestnet: true,
  chainId: ChainIds.EthereumRopsten,
  chainName: 'Ropsten',
  rpcEndpoints: ['https://ropsten.infura.io/v3/62bdcedba8ba449d9a795ef6310e713c'],
  gasStationEndpoint: 'https://gasprice.poa.network/',
  gqlEndpoints: {
    protocol: [graphHostedEndpoint('mstable', 'mstable-protocol-ropsten')],
    staking: [graphHostedEndpoint('mstable', 'mstable-staking-ropsten')],
    blocks: [graphHostedEndpoint('blocklytics', 'ropsten-blocks')],
    merkleDrop: [graphHostedEndpoint('mstable', 'mstable-merkle-drop-ropsten')],
    snapshot: ['https://hub.snapshot.org/graphql'],
    questbook: ['https://us-central1-mstable-questbook-ropsten.cloudfunctions.net/questbook'],
    emissions: [graphHostedEndpoint('mstable', 'mstable-emissions-ropsten')],
  },
  addresses: {
    MTA: '0x273bc479e5c21caa15aa8538decbf310981d14c0',
    vMTA: '0x77f9bf80e0947408f64faa07fd150920e6b52015',
    FeederWrapper: DEAD_ADDRESS,
    SaveWrapper: '',
    UniswapRouter02_Like: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    ERC20: {
      WETH: '0xc778417e063141139fce010982780140aa0cd5ab',
    },
  },
  getExplorerUrl: etherscanUrl('ropsten'),
}

const ETH_GOERLI: EthereumGoerli = {
  ...ETH_MAINNET,
  isTestnet: true,
  chainId: ChainIds.EthereumGoerli,
  chainName: 'Görli',
  rpcEndpoints: ['https://goerli.infura.io/v3/a6daf77ef0ae4b60af39259e435a40fe'],
  gasStationEndpoint: 'https://gasprice.poa.network/',
  gqlEndpoints: {
    protocol: [graphHostedEndpoint('mstable', 'mstable-protocol-goerli')],
    blocks: [graphHostedEndpoint('blocklytics', 'goerli-blocks')],
  },
  addresses: {
    MTA: '0x273bc479e5c21caa15aa8538decbf310981d14c0',
    vMTA: '0x77f9bf80e0947408f64faa07fd150920e6b52015',
    FeederWrapper: '0x17fd342630518E5AA2E96fbd2B8d895D7B3519e5',
    SaveWrapper: '0x5047Ee646E3425264416bf7d2a651985E513Ff32',
    UniswapRouter02_Like: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    ERC20: {
      WETH: '0xc778417e063141139fce010982780140aa0cd5ab',
    },
  },
  getExplorerUrl: etherscanUrl('goerli'),
}

const ETH_KOVAN: EthereumKovan = {
  ...ETH_MAINNET,
  isTestnet: true,
  chainId: ChainIds.EthereumKovan,
  chainName: 'Kovan',
  rpcEndpoints: ['https://kovan.infura.io/v3/62bdcedba8ba449d9a795ef6310e713c'],
  gasStationEndpoint: 'https://gasprice.poa.network/',
  gqlEndpoints: {
    protocol: [graphHostedEndpoint('mstable', 'mstable-protocol-kovan')],
    staking: [graphHostedEndpoint('mstable', 'mstable-staking-kovan')],
    blocks: [graphHostedEndpoint('blocklytics', 'kovan-blocks')],
    merkleDrop: [graphHostedEndpoint('mstable', 'mstable-merkle-drop-kovan')],
    snapshot: ['https://hub.snapshot.org/graphql'],
    questbook: ['https://us-central1-mstable-questbook-ropsten.cloudfunctions.net/questbook'],
  },
  addresses: {
    MTA: '0xe9553b420eab4ebe7237ac3f97035ef090f15e1d',
    vMTA: '0x77f9bf80e0947408f64faa07fd150920e6b52015',
    stkMTA: '0x9157233faFC65B5193c016B04fA847DB49677c3b',
    FeederWrapper: DEAD_ADDRESS,
    SaveWrapper: '',
    UniswapRouter02_Like: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    ERC20: {
      WETH: '0xE131AbCD2114bf457B1fBc5cE01593E06c435A63',
    },
    MerkleDropMBPTBAL: '0x4912c0fa9ed21f8f5420bdfaa097220120610082',
  },
  getExplorerUrl: etherscanUrl('kovan'),
}

const MATIC_MAINNET: MaticMainnet = {
  chainId: ChainIds.MaticMainnet,
  parentChainId: ChainIds.EthereumMainnet,
  protocolName: Networks.Polygon,
  chainName: 'Mainnet',
  nativeToken: {
    symbol: 'MATIC',
    decimals: 18,
    parentChainAddress: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
  },
  isMetaMaskDefault: false,
  isTestnet: false,
  blockTime: 7e3, // Actually 2 seconds, but that means a lot of request volume
  coingeckoId: 'matic-network',
  rpcEndpoints: [
    'https://rpc-mainnet.maticvigil.com/v1/9014a595065319bb6d40417c45281c2608a943c7',
    'https://rpc-mainnet.matic.quiknode.pro',
    'https://rpc-mainnet.maticvigil.com',
  ],
  gasStationEndpoint: 'https://gasstation-mainnet.matic.network',
  gqlEndpoints: {
    protocol: [graphHostedEndpoint('mstable', 'mstable-protocol-polygon')],
    blocks: [graphHostedEndpoint('elkfinance', 'matic-blocks')],
    stakingRewards: [graphHostedEndpoint('mstable', 'mstable-staking-rewards-polygon')],
    feeders: [graphHostedEndpoint('mstable', 'mstable-feeder-pools-polygon')],
  },
  addresses: {
    MTA: '0xf501dd45a1198c2e1b5aef5314a68b9006d842e0',
    vMTA: '0x77f9bf80e0947408f64faa07fd150920e6b52015', // Mainnet
    FeederWrapper: '0x17fd342630518E5AA2E96fbd2B8d895D7B3519e5', // Mainnet
    SaveWrapper: '0x299081f52738A4204C3D58264ff44f6F333C6c88',
    UniswapRouter02_Like: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff', // QuickSwap
    ERC20: {
      wMATIC: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      FXS: '0x3e121107F6F22DA4911079845a470757aF4e1A1b',
    },
    FRAX: {
      stakingContract: '0xc425Fd9Ed3C892d849C9E1a971516da1C1B29696',
      rewardsTokens: ['0x3e121107f6f22da4911079845a470757af4e1a1b', '0xf501dd45a1198c2e1b5aef5314a68b9006d842e0'],
      stakingToken: '0xb30a907084ac8a0d25dddab4e364827406fd09f0',
      feederPool: '0xb30a907084ac8a0d25dddab4e364827406fd09f0',
    },
  },
  getExplorerUrl: etherscanUrl(undefined, 'polygonscan.com'),
  supportedMassets: ['musd'],
}

const MATIC_MUMBAI: MaticMumbai = {
  ...MATIC_MAINNET,
  isTestnet: true,
  chainId: ChainIds.MaticMumbai,
  parentChainId: ChainIds.EthereumGoerli,
  chainName: 'Mumbai',
  rpcEndpoints: ['https://rpc-mumbai.maticvigil.com/v1/9014a595065319bb6d40417c45281c2608a943c7'],
  gasStationEndpoint: 'https://gasstation-mumbai.matic.today',
  gqlEndpoints: {
    protocol: [graphHostedEndpoint('mstable', 'mstable-protocol-polygon-mumbai')],
    // This is for mainnet, no subgraph available for Mumbai
    blocks: [graphHostedEndpoint('elkfinance', 'matic-blocks')],
  },
  addresses: {
    MTA: '0x273bc479e5c21caa15aa8538decbf310981d14c0', // Mainnet
    vMTA: '0x77f9bf80e0947408f64faa07fd150920e6b52015', // Mainnet
    FeederWrapper: '0x17fd342630518E5AA2E96fbd2B8d895D7B3519e5', // Mainnet
    SaveWrapper: '0xeB2A92Cc1A9dC337173B10cAbBe91ecBc805C98B',
    UniswapRouter02_Like: '0xFCB5348111665Cf95a777f0c4FCA768E05601760', // QuickSwap
    ERC20: {
      wMATIC: '0x5B67676a984807a212b1c59eBFc9B3568a474F0a',
    },
  },
  getExplorerUrl: etherscanUrl('mumbai', 'polygonscan.com'),
}

export const NETWORKS = [ETH_MAINNET, ETH_GOERLI, ETH_ROPSTEN, ETH_KOVAN, MATIC_MAINNET, MATIC_MUMBAI]

export const getNetwork = (chainId: ChainIds | 0): Extract<AllNetworks, { chainId: typeof chainId }> => {
  switch (chainId) {
    case 0:
    case ChainIds.EthereumMainnet:
    default:
      return ETH_MAINNET

    case ChainIds.EthereumRopsten:
      return ETH_ROPSTEN

    case ChainIds.EthereumKovan:
      return ETH_KOVAN

    case ChainIds.EthereumGoerli:
      return ETH_GOERLI

    case ChainIds.MaticMainnet:
      return MATIC_MAINNET

    case ChainIds.MaticMumbai:
      return MATIC_MUMBAI
  }
}

// TODO could still use an env var to define the default chain ID
// Or even domain matching (polygon.*)
const maybeCachedChainId = parseInt(localStorage.getItem('mostRecentChainId') as unknown as string)
const [useChainIdCtx, ChainIdProvider] = createStateContext<ChainIds | undefined>(
  Number.isFinite(maybeCachedChainId) ? (maybeCachedChainId as ChainIds) : ChainIds.EthereumMainnet,
)
export { useChainIdCtx }

const networkCtx = createContext<Network<unknown, unknown>>(null as never)

const networkPricesCtx = createContext<FetchState<NetworkPrices>>(null as never)

const jsonRpcCtx = createContext<{ provider: Provider; parentChainProvider?: Provider } | undefined>(undefined)

const NetworkConfigProvider: FC = ({ children }) => {
  const [chainId] = useChainIdCtx()

  const network = useMemo(() => getNetwork(chainId ?? ChainIds.EthereumMainnet), [chainId])

  return <networkCtx.Provider value={network}>{children}</networkCtx.Provider>
}

const NetworkPricesProvider: FC = ({ children }) => {
  const network = useContext(networkCtx)

  const [networkPrices, setNetworkPrices] = useFetchState<NetworkPrices>({})

  const fetchPrices = useCallback(async () => {
    if (!network) return

    setNetworkPrices.fetching()

    let gas: GasPrice

    // eth mainnet
    if (network.chainId === ChainIds.EthereumMainnet) {
      const gasStationResponse = await fetch(network.gasStationEndpoint)
      const gasRes: MyCryptoGas = await gasStationResponse.json()
      gas = {
        standard: gasRes.standard,
        fast: gasRes.fast,
        slow: gasRes.safeLow,
        instant: gasRes.fastest,
      }
      // eth testnet
    } else if ([ChainIds.EthereumGoerli, ChainIds.EthereumKovan, ChainIds.EthereumRopsten].includes(network.chainId)) {
      // Testnets should use low gas
      gas = {
        standard: 3,
        fast: 3,
        slow: 3,
        instant: 3,
      }
      // Matic Mainnet + Mumbai
    } else {
      const gasStationResponse = await fetch(network.gasStationEndpoint)
      const gasRes: MaticMainGas = await gasStationResponse.json()
      gas = {
        standard: Math.min(30, gasRes.standard),
        fast: Math.min(30, gasRes.fast),
        slow: Math.min(30, gasRes.safeLow),
        instant: Math.min(30, gasRes.fastest),
      }
    }
    const priceResponse = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${network.coingeckoId}&vs_currencies=usd`)

    const priceResult: Record<typeof network['coingeckoId'], { usd: number }> = await priceResponse.json()
    const nativeToken = priceResult[network.coingeckoId].usd

    setNetworkPrices.value({ nativeToken, gas })
  }, [network, setNetworkPrices])

  useEffect(() => {
    fetchPrices().catch(setNetworkPrices.error)
  }, [fetchPrices, network, setNetworkPrices.error])

  useInterval(() => {
    fetchPrices().catch(setNetworkPrices.error)
  }, 5 * 60 * 1000)

  return <networkPricesCtx.Provider value={networkPrices}>{children}</networkPricesCtx.Provider>
}

const JsonRpcProvider: FC = ({ children }) => {
  const network = useContext(networkCtx)

  const value = useMemo(() => {
    if (!network) return undefined

    const { rpcEndpoints, parentChainId } = network
    const provider = new providers.FallbackProvider(rpcEndpoints.map(e => new providers.JsonRpcProvider(e)))

    let parentChainProvider
    if (parentChainId) {
      const { rpcEndpoints: parentRpcEndpoints } = getNetwork(parentChainId)
      parentChainProvider = new providers.FallbackProvider(parentRpcEndpoints.map(e => new providers.JsonRpcProvider(e)))
    }

    return { provider, parentChainProvider }
  }, [network])

  return <jsonRpcCtx.Provider value={value}>{children}</jsonRpcCtx.Provider>
}

export const useJsonRpcProviders = (): { provider: Provider; parentChainProvider?: Provider } | undefined => useContext(jsonRpcCtx)

export const useNetwork = (): Network<unknown, unknown> => useContext(networkCtx)

export const useNetworkPrices = (): FetchState<NetworkPrices> => useContext(networkPricesCtx)

export const useNetworkAddresses = <T extends AllNetworks>(): T['addresses'] => useContext(networkCtx).addresses as T['addresses']

export const useGetExplorerUrl = (): Network<unknown, unknown>['getExplorerUrl'] => useNetwork().getExplorerUrl

export const NetworkProvider = composedComponent(ChainIdProvider, NetworkConfigProvider, NetworkPricesProvider, JsonRpcProvider)
