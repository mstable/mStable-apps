import type { LegacyPoolType } from './types'

export const getTokenIcon = (type: LegacyPoolType) => ({ uni: 'UNI-V2', bal: 'BAL', vmta: 'MTA' }[type])

export const getColor = (type: LegacyPoolType) => ({ uni: '#FF007A', bal: '#CFD4FF', vmta: '#CFD4FF' }[type])
