import React, { FC } from 'react'

import { FetchState } from '@apps/types'
import { useResolveENSName } from '../../hooks'

export const ResolveENS: FC<{ ensName: string; render: FC<{ resolvedENSName: FetchState<string | null> }> }> = ({
  ensName,
  render: View,
}) => {
  const resolvedENSName = useResolveENSName(ensName)
  return <View resolvedENSName={resolvedENSName} />
}
