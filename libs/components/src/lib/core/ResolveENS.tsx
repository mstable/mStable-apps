import React, { FC } from 'react'

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { FetchState } from '@apps/hooks'
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { useResolveENSName } from '@apps/base/hooks'

export const ResolveENS: FC<{ ensName: string; render: FC<{ resolvedENSName: FetchState<string | null> }> }> = ({
  ensName,
  render: View,
}) => {
  const resolvedENSName = useResolveENSName(ensName)
  return <View resolvedENSName={resolvedENSName} />
}
