import type { FC } from 'react'
import React from 'react'
import styled from 'styled-components'

import { useSelectedMassetName } from '@apps/masset-provider'
import { ExternalLink } from '@apps/components/core'
import { ReactComponent as EarnIcon } from '@apps/components/icons/circle/earn.svg'

import { PageHeader } from './PageHeader'

const Container = styled.div`
  > :last-child {
    text-align: center;
  }
`

export const EarnRedirect: FC = () => {
  const selectedMassetName = useSelectedMassetName()
  return (
    <Container>
      <PageHeader massetSwitcher title="Earn" icon={<EarnIcon />} subtitle="Ecosystem rewards with mStable" />
      <div>
        Visit the <ExternalLink href={`https://earn.mstable.org/#/${selectedMassetName}/earn`}>Earn App</ExternalLink> to access Earn
      </div>
    </Container>
  )
}
