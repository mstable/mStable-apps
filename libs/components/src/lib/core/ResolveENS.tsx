import React, { FC } from 'react'
import { FetchState, useResolveENSName } from '@apps/hooks'

export const ResolveENS: FC<{ ensName: string; render: FC<{ resolvedENSName: FetchState<string | null> }> }> = ({
  ensName,
  render: View,
}) => {
  const resolvedENSName = useResolveENSName(ensName)
  return <View resolvedENSName={resolvedENSName} />
}
