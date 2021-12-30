import React, { FC } from 'react'
import styled from 'styled-components'
import { TokenIcon } from '@apps/base/components/core'
import { CountUp, ThemedSkeleton, TableCell, TableRow } from '@apps/dumb-components'
import { useTokenSubscription } from '@apps/base/context/tokens'
import { useExploreAssetModal } from '@apps/base/hooks'

import { DashNameTableCell } from './Styled'
import { SubscribedToken } from '@apps/types'

const Balance = styled(CountUp)`
  > * {
    font-weight: normal !important;
    font-size: 1rem;
  }
`

export const WalletRow: FC<{ token: SubscribedToken; type?: 'masset' | 'fasset' | 'basset' }> = ({ token, type }) => {
  const { address, symbol } = token
  const [showExploreModal] = useExploreAssetModal()
  const { balance } = useTokenSubscription(address)

  const onRowClick = (symbol: string) => showExploreModal({ symbol, type })

  return (
    <TableRow key={address} buttonTitle="Explore" onClick={() => onRowClick?.(symbol)}>
      <DashNameTableCell>
        <TokenIcon symbol={symbol} />
        <span>{symbol}</span>
      </DashNameTableCell>
      <TableCell>{!!balance ? <Balance end={balance.simple} /> : <ThemedSkeleton />}</TableCell>
    </TableRow>
  )
}
