import React, { FC } from 'react'

import { truncateAddress } from '@apps/formatters'
import { ExternalLink } from '@apps/dumb-components'

import { useGetExplorerUrl } from '../../context/NetworkProvider'

export const ExplorerLink: FC<{
  data: string
  type?: 'transaction' | 'account' | 'address' | 'token'
  truncate?: boolean
  showData?: boolean
  className?: string
}> = ({ children, type = 'address', data, showData, truncate = true, className }) => {
  const getExplorerUrl = useGetExplorerUrl()
  return (
    <ExternalLink href={getExplorerUrl(data, type)} title={`View ${type} on Etherscan`} className={className}>
      {children || (showData ? (truncate ? truncateAddress(data) : data) : null)}
    </ExternalLink>
  )
}
