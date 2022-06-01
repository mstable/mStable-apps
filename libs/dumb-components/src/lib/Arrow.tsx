import styled from 'styled-components'

import type { FC } from 'react'

export const Container = styled.div`
  align-items: center;
  display: flex;
  font-size: 1.25rem;
  justify-content: center;
  padding: 1rem 0 0;
  text-align: center;
  user-select: none;
`

export const Arrow: FC<{ direction?: 'up' | 'down' }> = ({ direction = 'down', ...rest }) => {
  const arrowIcon = direction === 'up' ? '↑' : '↓'
  return <Container {...rest}>{arrowIcon}</Container>
}
