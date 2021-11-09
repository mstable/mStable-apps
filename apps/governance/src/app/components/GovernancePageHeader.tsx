import React, { FC } from 'react'

import { PageHeader } from '@apps/base/components/core'

import { StakedTokenSwitcher } from './StakedTokenSwitcher'

interface Props {
  title: string
  icon?: JSX.Element
  subtitle?: string
  stakedTokenSwitcher?: boolean
  backTo?: string
  backTitle?: string
}

export const GovernancePageHeader: FC<Props> = ({ children, title, subtitle, stakedTokenSwitcher, backTitle, backTo }) => {
  return (
    <PageHeader
      title={title}
      subtitle={subtitle}
      switcher={stakedTokenSwitcher && <StakedTokenSwitcher />}
      backTitle={backTitle}
      backTo={backTo}
    >
      {children}
    </PageHeader>
  )
}
