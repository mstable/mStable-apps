import React, { FC, ReactElement } from 'react'
import styled, { css } from 'styled-components'

import { UnstyledButton } from '@apps/components/core'

import { ReactComponent as CheckmarkIcon } from '@apps/components/icons/checkmark.svg'
import { ReactComponent as ChevronIcon } from '@apps/components/icons/chevron-down.svg'
import { ReactComponent as ExternalIcon } from '@apps/components/icons/external-link-arrow.svg'

interface Props {
  className?: string
  title?: ReactElement | string
  iconType?: 'checkmark' | 'chevron' | 'external'
  onClick?: () => void
  gradientColor?: string
}

const Icon = styled.div<{ isChevron?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.25s ease all;
  margin-left: 1rem;

  svg {
    width: 1rem;
    height: 1rem;
    transform: ${({ isChevron }) => (isChevron ? `rotate(-90deg)` : `auto`)};

    path {
      fill: ${({ theme }) => theme.color.body};
    }
  }
`

const Background = styled.div<{ gradientColor?: string }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: 1rem;
  opacity: 0.25;
`

const ContainerStyle = css`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  justify-content: flex-start;
  transition: 0.25s ease all;

  > div {
    display: flex;
    justify-content: space-between;
  }

  > div:not(:last-child) {
    align-items: center;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 600;
    text-align: left;
  }

  p {
    font-size: 1rem;
    line-height: 1.5rem;
    text-align: left;
    color: ${({ theme }) => theme.color.body};
  }
`

const ContainerButton = styled(UnstyledButton)`
  ${ContainerStyle};
  position: relative;
  border: 0;
  background: ${({ color, theme }) => (color ? `${color}11` : theme.color.background[1])};
  border: 1px solid ${({ color, theme }) => (color ? `${color}22` : theme.color.background[2])};

  &:before {
    content: ' ';
    position: absolute;
    border-radius: 1rem;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    opacity: 0;
    transition: opacity 250ms;
  }

  :hover:before {
    opacity: 1;
  }
`

const Container = styled.div<{ color: string }>`
  ${ContainerStyle};
  background: ${({ color, theme }) => (color ? `${color}11` : theme.color.background[1])};
  border: 1px solid ${({ color, theme }) => (color ? `${color}22` : theme.color.background[2])};
`

const CardContent: FC<Props> = props => {
  const { title, children, iconType } = props
  return (
    <>
      {(title || iconType) && (
        <div>
          <h2>{title}</h2>
          {iconType && (
            <Icon className="icon" isChevron={iconType === 'chevron'}>
              {iconType === 'checkmark' ? <CheckmarkIcon /> : iconType === 'external' ? <ExternalIcon /> : <ChevronIcon />}
            </Icon>
          )}
        </div>
      )}
      {children && <div>{children}</div>}
    </>
  )
}

export const Card: FC<Props> = ({ className, onClick, children, title, iconType, gradientColor }) => {
  return onClick ? (
    <ContainerButton className={className} onClick={onClick} color={gradientColor}>
      <CardContent title={title} iconType={iconType}>
        {children}
      </CardContent>
    </ContainerButton>
  ) : (
    <Container className={className} color={gradientColor}>
      <CardContent title={title} iconType={iconType}>
        {children}
      </CardContent>
    </Container>
  )
}
