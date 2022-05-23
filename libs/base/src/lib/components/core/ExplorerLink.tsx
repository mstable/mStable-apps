import { ExternalLink } from '@apps/dumb-components'
import { truncateAddress } from '@apps/formatters'

import { getNetwork, useNetwork } from '../../context/NetworkProvider'

import type { FC } from 'react'

import type { ChainIds } from '../../context/NetworkProvider'

export const ExplorerLink: FC<{
  data: string
  type?: 'transaction' | 'account' | 'address' | 'token'
  truncate?: boolean
  showData?: boolean
  className?: string
  chainId?: ChainIds
}> = ({ children, type = 'address', data, showData, truncate = true, className, chainId }) => {
  const defaultNetwork = useNetwork()
  const network = chainId ? getNetwork(chainId) : defaultNetwork
  return (
    <ExternalLink href={network.getExplorerUrl(data, type)} title={`View ${type} on explorer`} className={className}>
      {children || (showData ? (truncate ? truncateAddress(data) : data) : null)}
    </ExternalLink>
  )
}
