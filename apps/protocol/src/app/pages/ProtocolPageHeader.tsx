import React, { FC } from 'react'
import { MassetSwitcher, PageHeader } from '@apps/components/core'
import { useNetwork } from '@apps/base/context/network'

interface Props {
  title: string
  subtitle?: string
  massetSwitcher?: boolean
}

export const ProtocolPageHeader: FC<Props> = ({ title, children, subtitle, massetSwitcher }) => {
  const { supportedMassets } = useNetwork()
  const showSwitcher = supportedMassets.length > 1 && !!massetSwitcher

  return (
    <PageHeader title={title} subtitle={subtitle} switcher={showSwitcher && <MassetSwitcher />}>
      {children}
    </PageHeader>
  )
}
