import React, { FC } from 'react'
import styled from 'styled-components'
import warningSvg from '@apps/components/icons/warning.svg'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;

  > img {
    width: 1.5rem;
    height: auto;
  }

  > div {
    color: ${({ theme }) => theme.color.bodyAccent};
    font-size: 0.8rem;
    line-height: 1.2rem;
  }
`

export const Warning: FC<{ alt?: string }> = ({ alt = 'Warning', children }) => (
  <Container>
    <img src={warningSvg} alt={alt} />
    <div>{children}</div>
  </Container>
)
