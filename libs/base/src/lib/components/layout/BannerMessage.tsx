import React, { FC } from 'react'
import styled from 'styled-components'

import { useBannerMessage } from '../../context/BannerProvider'
import { Color } from '@apps/theme'

const Container = styled.div<{ statusColor: string | undefined }>`
  background: ${({ statusColor }) => statusColor};
  text-align: center;
  font-size: 0.75rem;
  line-height: 1.5rem;
  border-bottom: 1px solid ${({ statusColor }) => statusColor};
  overflow-wrap: normal;

  p {
    opacity: 0.75;

    a {
      opacity: 1;
    }
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
    }[status]

  return !!bannerMessage ? <Container statusColor={statusColor}>{content}</Container> : null
}
