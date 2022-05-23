import { UnstyledButton } from '@apps/dumb-components'
import styled from 'styled-components'

export const SwitchButton = styled(UnstyledButton)`
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  border-radius: 1rem;
  margin-top: 1rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.color.bodyAccent};
  width: 100%;

  :hover {
    ${({ theme }) => ({
      color: `${theme.color.gold}`,
    })};
  }
`
