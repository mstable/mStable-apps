import React, { FC, createContext, useMemo, useContext, useRef, useEffect } from 'react'
import { useEmissionsQuery } from '@apps/artifacts/graphql/emissions'
import { useApolloClients } from '@apps/base/context/apollo'
import { useAccount, useSigner } from '@apps/base/context/account'
import { truncateAddress } from '@apps/formatters'
import { EmissionsController, EmissionsController__factory } from '@apps/artifacts/typechain'
import { useAccountQuery } from '@apps/artifacts/graphql/staking'
import { BigDecimal } from '@apps/bigdecimal'

interface State {
  data?: {
    dials: {
      key: string
      title: string
      value: number
      id: number
    }[]
    userVotePower?: BigDecimal
    userDials: Record<string, number>
    emission: number
    currentEpoch: number
  }
}

const MOCK_DATA = {
  data: {
    dials: [
      {
        title: 'imUSD Vault',
        value: 30,
        id: 0,
        key: 'p-imusd',
      },
      {
        title: 'MTA Stakers',
        id: 1,
        value: 25,
        key: 'stk-mta',
      },
      {
        title: 'mBPT Stakers',
        id: 2,
        value: 10,
        key: 'stk-bpt',
      },
      {
        title: 'OlympusPro Bonds',
        id: 3,
        value: 5,
        key: 'olympus-bonds',
      },
      {
        title: 'RAI Pool',
        id: 4,
        value: 10,
        key: 'f-rai',
      },
      {
        title: 'alUSD Pool',
        id: 5,
        value: 10,
        key: 'f-alusd',
      },
      {
        title: 'FEI Pool',
        id: 6,
        value: 10,
        key: 'f-fei',
      },
    ],
    userDials: {
      'p-imusd': 7,
      'stk-mta': 30,
      'stk-bpt': 15,
      'olympus-bonds': 5,
      'f-rai': 10,
      'f-alusd': 23,
      'f-fei': 10,
    },
    emission: 50000,
    currentEpoch: 1637768286000,
  },
}

const contractCtx = createContext<EmissionsController | undefined>(null as never)
const stateCtx = createContext<State>(MOCK_DATA)

export const useEmissionDialsContract = (): EmissionsController | undefined => useContext(contractCtx)
export const useEmissionDialsState = (): State => useContext(stateCtx)

const MAPPING = [
  { title: 'MTA Staking', key: 'stk-mta' },
  { title: 'mBPT Staking', key: 'stk-bpt' },
  { title: 'imUSD Vault', key: 'imusd-vault' },
  { title: 'imBTC Vault', key: 'imbtc-vault' },
]

export const DialsProvider: FC = ({ children }) => {
  const clients = useApolloClients()
  const account = useAccount()
  const signer = useSigner()

  const options = useMemo<{
    emissions: Parameters<typeof useEmissionsQuery>[0]
    staking: Parameters<typeof useAccountQuery>[0]
  }>(() => {
    return {
      emissions: {
        client: clients.emissions,
        variables: { account: account ?? '', hasAccount: !!account },
        pollInterval: 60e3,
      },
      staking: {
        client: clients.staking,
        variables: { id: account ?? '', skip: !account },
        pollInterval: 60e3,
      },
    }
  }, [account, clients])

  const { data: stakingData } = useAccountQuery(options.staking)

  const { data: emissionsData } = useEmissionsQuery(options.emissions)

  const dialsContract = useRef<EmissionsController | undefined>(undefined)

  const controller = emissionsData?.emissionsControllers?.[0]

  const voters = emissionsData?.voters?.[0]

  const userVotePower = stakingData?.account?.totalVotesAllBD

  const finalData = useMemo(() => {
    if (!controller) {
      return {
        data: {
          dials: [],
          userDials: {},
          emission: 0,
          currentEpoch: 0,
        },
      }
    }

    const dials = controller.dials.map((v, i) => ({
      title: MAPPING[v.dialId]?.title ?? truncateAddress(v.recipient),
      value: (v.preferences?.[0]?.weight ?? 0) / 2,
      id: i,
      key: MAPPING[v.dialId]?.key ?? truncateAddress(v.recipient),
    }))

    const userDials = Object.fromEntries(
      (voters?.preferences ?? []).map(v => [MAPPING[v.dial.dialId]?.key ?? truncateAddress(v.dial.recipient), (v.weight ?? 0) / 2]),
    )

    const emission = parseFloat(controller.epochs[0]?.emission)

    // TODO revert
    // const distributionPeriod = 604800
    const distributionPeriod = 3600

    const currentEpoch = controller.epochs[0]?.weekNumber * distributionPeriod * 1000

    return {
      data: {
        dials,
        userDials,
        userVotePower,
        emission,
        currentEpoch,
      },
    }
  }, [controller, voters, userVotePower])

  useEffect(() => {
    if (!controller?.id) return
    dialsContract.current = EmissionsController__factory.connect(controller.id, signer)
  }, [signer, controller])

  return (
    <contractCtx.Provider value={dialsContract.current}>
      <stateCtx.Provider value={finalData}>{children}</stateCtx.Provider>
    </contractCtx.Provider>
  )
}
