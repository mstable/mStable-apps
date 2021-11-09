import type { FC } from 'react'
import React from 'react'
import styled from 'styled-components'

import { useSelectedMassetName } from '@apps/masset-provider'
import { ExternalLink } from '@apps/dumb-components'

import { ProtocolPageHeader as PageHeader } from './ProtocolPageHeader'

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
