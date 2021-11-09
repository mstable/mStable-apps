import type { FC } from 'react'
import styled from 'styled-components'

import { AddressInput } from '@apps/dumb-components'

interface Props {
  title: string
  onClick: (address?: string) => void
}

const Container = styled.div`
  flex: 1;
  padding: 0.75rem 1rem 0.25rem 1rem;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  border-radius: 1rem;
  width: 100%;

  > h4 {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.color.bodyAccent};
  }

  input {
    font-size: 1.25rem;
    padding-left: 0;
  }
`

export const UserLookup: FC<Props> = ({ onClick, title }) => {
  return (
    <Container>
      <h4>{title}</h4>
      <AddressInput title="View" onClick={onClick} />
    </Container>
  )
}
