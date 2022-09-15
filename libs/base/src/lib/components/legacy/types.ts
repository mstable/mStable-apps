export type LegacyPoolType = 'uni' | 'bal' | 'vmta'

export type LegacyContract = {
  address: string
  name: string
  info: string
  poolType: LegacyPoolType
}
