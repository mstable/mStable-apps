import { ReactComponent as LockIcon } from '@apps/icons/lock-alt.svg'
import { ReactComponent as TokensIcon } from '@apps/icons/tokens.svg'
import styled from 'styled-components'

import { UnstyledButton } from './Button'

import type { FC } from 'react'

interface Props {
  title: string
  content: string
  icon?: 'lock' | 'tokens'
  onClick: () => void
}

const Container = styled(UnstyledButton)`
  background: ${({ theme }) => theme.color.background[1]};
  padding: 1rem;
  border-radius: 1rem;
  transition: 0.25s;

  :hover {
    background: ${({ theme }) => theme.color.background[2]};
  }

  > div:first-child {
    display: flex;
    justify-content: space-between;
    align-items: center;

    > div {
      display: flex;
      align-items: center;

      h3 {
        font-size: 1rem;
        font-weight: 600;
        text-align: left;
      }

      > svg {
        width: auto;
        height: 1.75rem;
        margin-right: 0.5rem;
        margin-top: -2px;
      }
    }

    span {
      font-size: 1.5rem;
      color: ${({ theme }) => theme.color.body};
      ${({ theme }) => theme.mixins.numeric};
      margin-top: -0.675rem;
    }
  }

  > div:last-child {
    margin-top: 0.5rem;
    text-align: left;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.color.bodyAccent};
  }
`

export const InfoButton: FC<Props> = ({ onClick, title, content, icon = 'lock' }) => {
  return (
    <Container onClick={onClick}>
      <div>
        <div>
          {icon === 'lock' && <LockIcon />}
          {icon === 'tokens' && <TokensIcon />}
          <h3>{title}</h3>
        </div>
        <span>↗</span>
      </div>
      <div>
        <p>{content}</p>
      </div>
    </Container>
  )
}
