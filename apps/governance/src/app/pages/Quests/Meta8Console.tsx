import React, { FC, useState } from 'react'
import styled from 'styled-components'

import { Meta8Logic } from './Meta8Logic'
import { RealisticSwitch } from './RealisticSwitch'

const Display = styled.div<{ isOn: boolean }>`
  @keyframes scandown {
    0% {
      background-position-y: 0;
    }
    100% {
      background-position-y: -2px;
    }
  }

  background: ${({ theme, isOn }) => (isOn ? '#000e32' : theme.isLight ? '#2c2b2b' : '#000')};
  box-shadow: ${({ theme, isOn }) =>
    `0 0 10px 5px rgba(0, 0, 0, 0.25) inset, 0 0 10px 0 rgba(0, 0, 0, 0.5), rgba(80, 156, 255, ${
      isOn && !theme.isLight ? 0.8 : 0
    }) -2px 0 30px`};
  border-radius: 1.375rem;
  flex: 1;
  display: flex;
  padding: 0.5rem;

  > div {
    flex: 1;
    position: relative;
    background: ${({ theme, isOn }) => (isOn ? (theme.isLight ? '#443836' : '#29252f') : 'transparent')};
    transition: background-color 1s ease-in;
    box-shadow: inset 0 0 10px 5px rgba(0, 0, 0, 0.25);
    border-radius: 18px;
    overflow: hidden;
    height: 29rem;

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
      justify-content: space-between;
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
  const [isOn, setIsOn] = useState(true)

  return (
    <Container>
      <div>
        <Display isOn={isOn}>
          <div>
            {isOn && (
              <>
                <Meta8Logic isBooted={true} />
                <div className="scanlines" />
              </>
            )}
          </div>
        </Display>
        <div>
          <div />
          <img src="/assets/meta-8.png" alt="Meta-8" />
          <RealisticSwitch
            checked={isOn}
            onClick={() => {
              setIsOn(!isOn)
            }}
          />
        </div>
      </div>
    </Container>
  )
}
