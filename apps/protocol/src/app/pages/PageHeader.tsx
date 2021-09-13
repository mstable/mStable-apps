import React, { FC } from 'react'
import styled from 'styled-components'
import { BannerMessage } from '@apps/base'
import { useBannerMessage } from '@apps/base/context/app'
import { useNetwork } from '@apps/base/context/network'
import { ViewportWidth } from '@apps/base/theme'
import { MassetDropdown } from '@apps/components/core'

interface Props {
  title: string
  icon: JSX.Element
  subtitle?: string
  massetSwitcher?: boolean
}

const StyledMassetDropdown = styled(MassetDropdown)`
  margin-left: 0.75rem;
`

const Icon = styled.div<{ inverted?: boolean }>`
  display: flex;
  margin-right: 0.5rem;

  img,
  svg {
    width: 2.25rem;
    height: 2.25rem;

    * {
      fill: ${({ theme }) => theme.color.body};
    }
  }

  img + div {
    display: none;
  }
`

const Container = styled.div<{
  messageVisible?: boolean
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;

  h2 {
    font-size: 2rem;
    font-weight: 600;
  }

  p {
    padding: 0.25rem 0 0;
    font-size: 1rem;
    color: ${({ theme }) => theme.color.bodyAccent};
  }

  > *:not(:last-child) {
    margin-bottom: 0.5rem;
  }

  @media (min-width: ${ViewportWidth.s}) {
    padding: 3rem 0;
  }
`

const Row = styled.div`
  display: flex;
  align-items: center;
`

const ChildrenRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;

  @media (min-width: ${({ theme }) => theme.viewportWidth.s}) {
    flex-direction: row;
  }
`

export const PageHeader: FC<Props> = ({ children, title, subtitle, icon, massetSwitcher }) => {
  const [bannerMessage] = useBannerMessage()
  const { supportedMassets } = useNetwork()

  return (
    <div>
      <Container>
        <Row>
          <Icon inverted>{icon}</Icon>
          <h2>{title}</h2>
          {massetSwitcher && supportedMassets.length > 1 && <StyledMassetDropdown />}
        </Row>
        {subtitle && <p>{subtitle}</p>}
        {children && <ChildrenRow>{children}</ChildrenRow>}
      </Container>
      {!!bannerMessage && <BannerMessage />}
    </div>
  )
}
