import React, { FC, useLayoutEffect } from 'react'
import { useParams } from 'react-router-dom'
import { isAddress } from 'ethers/lib/utils'

import { ResolveENS } from '@apps/base/components/core'
import { FetchState } from '@apps/types'

import { DelegateePageHeader } from '../../components/DelegateePageHeader'
import { useDelegateesAll } from '../../context/DelegateeLists'
import { DelegateeProfile } from './DelegateeProfile'

const Content: FC<{ address?: string; addressOrENSName: string; resolvedENSName?: FetchState<string | null> }> = ({
  address,
  addressOrENSName,
  resolvedENSName,
}) => {
  const all = useDelegateesAll()
  const resolvedAddress = address ?? resolvedENSName.value
  const delegateeInfo =
    (address ? all[address] : all[addressOrENSName]) ?? (resolvedAddress && all[resolvedAddress.toLowerCase()]) ?? undefined

  return (
    <div>
      <DelegateePageHeader addressOrENSName={addressOrENSName} address={resolvedAddress} delegateeInfo={delegateeInfo} />
      <DelegateeProfile delegateeInfo={delegateeInfo} addressOrENSName={addressOrENSName} address={resolvedAddress} />
    </div>
  )
}

export const Delegatee: FC = () => {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  const { delegatee: addressOrENSName } = useParams<{ delegatee: string }>()

  return isAddress(addressOrENSName) ? (
    <Content address={addressOrENSName} addressOrENSName={addressOrENSName} />
  ) : (
    <ResolveENS
      ensName={addressOrENSName}
      render={({ resolvedENSName }) => <Content addressOrENSName={addressOrENSName} resolvedENSName={resolvedENSName} />}
    />
  )
}
