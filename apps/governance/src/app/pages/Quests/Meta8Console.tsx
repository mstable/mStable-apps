import React, { FC } from 'react'
import styled from 'styled-components'

import { Meta8Logic } from './Meta8Logic'

const Display = styled.div`
  @keyframes scandown {
    0% {
      background-position-y: 0;
    }
    100% {
      background-position-y: -2px;
    }
  }

  background: ${({ theme }) => (theme.isLight ? '#2c2b2b' : '#000')};
  box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.25) inset, 0 0 10px 0 rgba(0, 0, 0, 0.5);
  border-radius: 1.375rem;
  flex: 1;
  display: flex;
  padding: 0.5rem;

  > div {
    flex: 1;
    position: relative;
    background: ${({ theme }) => (theme.isLight ? '#443836' : '#29252f')};
    box-shadow: inset 0 0 10px 5px rgba(0, 0, 0, 0.25);
    border-radius: 18px;
    overflow: hidden;

    &:after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 2;
      background-image: linear-gradient(to left bottom, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 50%);
      border-radius: 1rem;
    }
  }

  .scanlines {
    background-image: url('/assets/scanlines.png');
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    mix-blend-mode: soft-light;
    opacity: 0.4;
    animation: scandown 200ms infinite;
  }
`

const Container = styled.div`
  background: ${({ theme }) => (theme.isLight ? `url('/assets/beige.jpg')` : `url('/assets/blue.jpg')`)} repeat;
  border-radius: 2rem;
  box-shadow: 0 0 10px 4px ${({ theme }) => (theme.isLight ? `rgba(255, 255, 255, 0.47)` : `rgba(39, 39, 39, 0.47)`)} inset;
  padding: 0.5rem;
  border: 1px ${({ theme }) => theme.color.defaultBorder} solid;

  > div {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;

    > :last-child {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 1rem 0.5rem 0.5rem;

      img {
        width: 7.5rem;
        height: auto;
      }
    }
  }
`

export const Meta8Console: FC = () => {
  return (
    <Container>
      <div>
        <Display>
          <div>
            <Meta8Logic />
            <div className="scanlines" />
          </div>
        </Display>
        <div>
          <img src="/assets/meta-8.png" alt="Meta-8" />
        </div>
      </div>
    </Container>
  )
}
