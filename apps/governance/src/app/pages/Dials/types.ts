import { Networks } from '@apps/base/context/network'
import { BigDecimal } from '@apps/bigdecimal'

export interface DialMetadata {
  key: string
  title: string
  network: Networks
}

export interface Dial {
  dialId: number
  metadata: DialMetadata
  balance: number
  votes: number
  recipient: string
}

export interface EpochDialVotes {
  [dialId: number]: { votes: number; preferences: { [voter: string]: number } }
}

export interface Epoch {
  weekNumber: number
  emission: number
  dialVotes?: EpochDialVotes
}

export interface UserDialPreferences {
  [dialId: number]: number
}

export interface EmissionsUser {
  address: string
  isDelegatee: boolean
  dialPreferences: UserDialPreferences
  votePower?: BigDecimal
  lastSourcePoke?: number
}

export interface EmissionsData {
  address: string
  dials: { [dialId: number]: Dial }
  user?: EmissionsUser
  lastEpoch: Epoch
  lastEpochWeekNumber: number
  startEpochWeekNumber: number
}
