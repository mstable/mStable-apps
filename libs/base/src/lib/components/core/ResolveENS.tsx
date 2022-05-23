import { useResolveENSName } from '../../hooks'

import type { FetchState } from '@apps/types'
import type { FC } from 'react'

export const ResolveENS: FC<{ ensName: string; render: FC<{ resolvedENSName: FetchState<string | null> }> }> = ({
  ensName,
  render: View,
}) => {
  const resolvedENSName = useResolveENSName(ensName)
  return <View resolvedENSName={resolvedENSName} />
}
