import { Link } from 'react-router-dom'
import styled from 'styled-components'

import type { FC } from 'react'

interface Props {
  to?: string
  title?: string
  className?: string
}

const Arrow: FC = () => (
  <svg width="17" height="8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M.646 3.646a.5.5 0 000 .708l3.182 3.182a.5.5 0 00.708-.708L1.707 4l2.829-2.828a.5.5 0 10-.708-.708L.646 3.646zM17 3.5H1v1h16v-1z"
      fill="#9C9C9C"
    />
  </svg>
)

const Container = styled(Link)`
  color: ${({ theme }) => theme.color.bodyAccent};
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.5rem;
`

export const BackLink: FC<Props> = ({ to, title, className }) => {
  if (!to) return null
  return (
    <Container to={to} className={className}>
      <Arrow />
      <span>{title ?? 'Back'}</span>
    </Container>
  )
}
