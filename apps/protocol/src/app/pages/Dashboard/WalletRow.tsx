import { TokenIcon } from '@apps/base/components/core'
import { useTokenSubscription } from '@apps/base/context/tokens'
import { useExploreAssetModal } from '@apps/base/hooks'
import { CountUp, TableCell, TableRow, ThemedSkeleton } from '@apps/dumb-components'
import styled from 'styled-components'

import { DashNameTableCell } from './Styled'

import type { SubscribedToken } from '@apps/types'
import type { FC } from 'react'

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
      <TableCell>{balance ? <Balance end={balance.simple} /> : <ThemedSkeleton />}</TableCell>
    </TableRow>
  )
}
