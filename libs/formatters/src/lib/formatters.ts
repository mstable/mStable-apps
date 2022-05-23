import { ErrorCode } from '@ethersproject/logger'
import {
  eachDayOfInterval,
  eachHourOfInterval,
  eachMonthOfInterval,
  eachQuarterOfInterval,
  eachWeekOfInterval,
  eachYearOfInterval,
  format,
  fromUnixTime,
} from 'date-fns'
import * as Numeral from 'numeral'

export enum TimeMetricPeriod {
  Hour = 'HOUR',
  Day = 'DAY',
  Week = 'WEEK',
  Month = 'MONTH',
  Quarter = 'QUARTER',
  Year = 'YEAR',
}

export const periodIntervalMapping: Record<TimeMetricPeriod, (interval: Interval) => Date[]> = {
  [TimeMetricPeriod.Hour]: eachHourOfInterval,
  [TimeMetricPeriod.Day]: eachDayOfInterval,
  [TimeMetricPeriod.Week]: eachWeekOfInterval,
  [TimeMetricPeriod.Month]: eachMonthOfInterval,
  [TimeMetricPeriod.Quarter]: eachQuarterOfInterval,
  [TimeMetricPeriod.Year]: eachYearOfInterval,
}

export const periodFormatMapping: Record<TimeMetricPeriod, string> = {
  [TimeMetricPeriod.Hour]: 'HH',
  [TimeMetricPeriod.Day]: 'dd-MM',
  [TimeMetricPeriod.Week]: 'w',
  [TimeMetricPeriod.Month]: 'MM',
  [TimeMetricPeriod.Quarter]: 'Q',
  [TimeMetricPeriod.Year]: 'YYYY',
}

export const toK = (value: number): string => Numeral.default(value).format('0.[00]a')

export const percentageFormat = (value: number): string => `${value.toFixed(2)}%`

export const truncateAddress = (address: string): string => `${address.slice(0, 6)}…${address.slice(-4)}`

export const humanizeList = (list: string[]): string =>
  list.length < 3 ? list.join(' and ') : `${list.slice(0, -1).join(', ')}, and ${list[list.length - 1]}`

interface EthersError extends Error {
  code?: ErrorCode
  error?: Error
}

const sanitizeEthersError = (error: EthersError): string => {
  let { message } = error

  switch (error.code) {
    case ErrorCode.UNPREDICTABLE_GAS_LIMIT: {
      if (error.error?.message) {
        break
      }
      return 'Unable to estimate gas'
    }
    case ErrorCode.INSUFFICIENT_FUNDS:
      return 'Insufficient funds'
    case ErrorCode.NETWORK_ERROR:
      return 'Network error'
    case ErrorCode.REPLACEMENT_UNDERPRICED:
      return 'Replacement transaction underpriced'
    case ErrorCode.TIMEOUT:
      return 'Timeout'
    default:
      break
  }

  if (error.error?.message) {
    message = error.error.message
  }

  return message.replace('execution reverted: ', '')
}

export const sanitizeMassetError = (error: EthersError): string => {
  const message = sanitizeEthersError(error)

  switch (message) {
    case 'Out of bounds':
      return 'This swap would exceed hard limits to maintain diversification. Try a different pair of assets or a smaller amount.'
    default:
      return message
  }
}

export const formatUnix = (unixTime: number, dateFormat = 'dd-MM-yyyy'): string => format(fromUnixTime(unixTime), dateFormat)

export const getPenaltyMessage = (amount: number | undefined): string | undefined => {
  if (!amount) return undefined

  const abs = Math.abs(amount).toFixed(4)
  return amount > 0 ? `There is a price bonus of +${abs}%` : `There is a price penalty of -${abs}%`
}

export const getKeyTimestamp = (key: string): number => {
  const [, splitKey] = key.split('t')
  return parseInt(splitKey, 10)
}
