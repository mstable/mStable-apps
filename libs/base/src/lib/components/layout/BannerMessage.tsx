import { Color, ViewportWidth } from '@apps/theme'
import styled from 'styled-components'

import { useBannerMessage } from '../../context/BannerProvider'

import type { FC } from 'react'

const Container = styled.div<{ statusColor: string | undefined }>`
  background: ${({ statusColor }) => statusColor};
  text-align: center;
  font-size: 0.75rem;
  line-height: 1.5rem;
  overflow-wrap: normal;
  display: none;

  p {
    opacity: 0.75;

    a {
      opacity: 1;
    }
  }

  @media (min-width: ${ViewportWidth.s}) {
    display: inherit;
  }
`

export const BannerMessage: FC = () => {
  const [bannerMessage] = useBannerMessage()
  const { content, status } = bannerMessage ?? {}
  const statusColor =
    status &&
    {
      warning: Color.yellowTransparent,
      info: Color.coolBlueTransparent,
      none: 'transparent',
    }[status]

  return bannerMessage ? <Container statusColor={statusColor}>{content}</Container> : null
}
