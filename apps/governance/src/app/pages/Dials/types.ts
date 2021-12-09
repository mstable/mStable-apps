import { Networks } from '@apps/base/context/network'
import { BigDecimal } from '@apps/bigdecimal'

export interface DialMetadata {
  title: string
  network: Networks
  color: string
  description?: string
  link?: string
  linkTitle?: string
}

export interface Dial {
  dialId: number
  metadata: DialMetadata
  balance: number
  votes: number
  recipient: string
  cap?: number
}

export interface EpochDialVotes {
  [dialId: number]: { votes: number; voteShare: number; preferences: { [voter: string]: { weight: number; votesCast: number } } }
}

export interface Epoch {
  weekNumber: number
  emission: number
  totalVotes: number
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

export interface ActiveDial {
  dialVotes: EpochDialVotes[number]
  dial: Dial
}
