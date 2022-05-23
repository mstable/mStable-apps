import React from 'react'

import { ExternalLink } from '@apps/dumb-components'
import { useSelectedMassetName } from '@apps/masset-provider'
import styled from 'styled-components'

import { ProtocolPageHeader as PageHeader } from './ProtocolPageHeader'

import type { FC } from 'react'

const Container = styled.div`
  > :last-child {
    text-align: center;
  }
`

export const EarnRedirect: FC = () => {
  const selectedMassetName = useSelectedMassetName()
  return (
    <Container>
      <PageHeader massetSwitcher title="Earn" subtitle="Ecosystem rewards with mStable" />
      <div>
        Visit the <ExternalLink href={`https://earn.mstable.org/#/${selectedMassetName}/earn`}>Earn App</ExternalLink> to access Earn.
      </div>
    </Container>
  )
}
