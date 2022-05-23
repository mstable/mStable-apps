import React from 'react'

import { ReactComponent as BackgroundSvg } from '@apps/icons/illustration-graph.svg'
import { ReactComponent as TokensSvg } from '@apps/icons/illustration-tokens.svg'
import { ViewportWidth } from '@apps/theme'
import styled from 'styled-components'

import type { FC } from 'react'

const Tokens = styled(TokensSvg)`
  position: absolute;
  bottom: -1rem;
  left: 1.5rem;
  width: 70%;
  min-width: 16rem;

  @media (min-width: ${ViewportWidth.s}) {
    bottom: 0rem;
    left: 3.5rem;
    width: 55%;
  }

  @media (min-width: ${ViewportWidth.m}) {
    bottom: 1rem;
    left: 2rem;
    width: 75%;
  }
`

const Title = styled.h2`
  top: 2rem;
  left: 2rem;
  position: absolute;
  font-size: 1.5rem;
  font-weight: 500;

  @media (min-width: ${ViewportWidth.m}) {
    font-size: 1.75rem;
  }
`

const Background = styled(BackgroundSvg)`
  width: 100%;
  height: 100%;
  min-height: 10rem;
  min-width: 16rem;

  @media (min-width: ${ViewportWidth.s}) {
    min-height: 13rem;
  }
`

const Container = styled.div`
  position: relative;
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  overflow: hidden;
  min-height: 10rem;

  @media (min-width: ${ViewportWidth.s}) {
    min-height: 13rem;
  }
`

export const Illustration: FC = () => {
  return (
    <Container>
      <Title>Grow your assets</Title>
      <Tokens />
      <Background preserveAspectRatio="none" />
    </Container>
  )
}
