import warningSvg from '@apps/icons/warning.svg'
import styled from 'styled-components'

import type { FC } from 'react'

const Container = styled.div<{ highlight?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;

  > img {
    width: 1.5rem;
    height: auto;
  }

  > div {
    color: ${({ theme, highlight }) => (highlight ? theme.color.body : theme.color.bodyAccent)};
    font-size: 0.8rem;
    line-height: 1.2rem;
  }
`

export const Warning: FC<{ alt?: string; highlight?: boolean }> = ({ alt = 'Warning', highlight, children }) => (
  <Container highlight={highlight}>
    <img src={warningSvg} alt={alt} />
    <div>{children}</div>
  </Container>
)
