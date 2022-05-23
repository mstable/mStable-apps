import { ReactComponent as ExternalLinkArrow } from '@apps/icons/external-link-arrow.svg'
import styled from 'styled-components'

import type { AnchorHTMLAttributes, FC } from 'react'

const Anchor = styled.a`
  border-bottom: 0;
  svg {
    margin-left: 4px;
    width: 14px;
    height: auto;

    path {
      fill: ${({ theme }) => theme.color.body};
    }
  }
`

export const ExternalLink: FC<AnchorHTMLAttributes<never>> = ({ children, className, href }) => (
  <Anchor className={className} href={href} target="_blank" rel="noopener noreferrer">
    <span>{children}</span>
    <ExternalLinkArrow />
  </Anchor>
)
