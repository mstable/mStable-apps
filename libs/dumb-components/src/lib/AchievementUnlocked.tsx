import mtaImg from '@apps/icons/tokens/MTA.svg'
import styled, { css } from 'styled-components'

import type { FC } from 'react'

const QP = styled.div`
  padding: 0 0.5rem;
  background: ${({ theme }) => theme.color.blue};
  color: white;
  font-size: 0.8rem;
  border-radius: 0.5rem;
  white-space: nowrap;
  margin-right: 0.5rem;
`

const Container = styled.div<{ isObjective: boolean }>`
  ${({ theme }) => theme.mixins.mono};

  background-color: ${({ isObjective }) => (isObjective ? '#333' : 'rgb(80,107,88)')};
  color: #fff;
  display: flex !important;
  width: 22rem;
  height: 4rem;
  border-radius: 2rem;
  overflow: hidden;

  @keyframes astroboi {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes circleAnim {
    0% {
      opacity: 0;
      transform: scale(0.1);
    }
    75% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .circle {
    background-color: rgb(123, 160, 136);
    border-radius: 2rem;
    width: 4rem;
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;

    animation: circleAnim;
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
    transform-origin: center;

    img {
      width: 3rem;
      height: 3rem;
      ${({ isObjective }) =>
        isObjective
          ? ''
          : css`
              animation: astroboi 4s linear infinite;
            `}
    }
  }

  .banner {
    padding: 0.6rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 4rem;
  }

  .details {
    display: flex;
    align-items: center;
    gap: 0.2rem;
  }

  .complete {
    font-size: 0.9rem;
    line-height: 0.9rem;
  }

  .title {
    font-size: 0.75rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 11rem;
  }
`

export const AchievementUnlocked: FC<{ title: string; points?: number; className?: string; onClick?: () => void }> = ({
  title,
  points,
  className,
  onClick,
}) => {
  const isObjective = !!points

  return (
    <Container isObjective={isObjective} onClick={onClick} className={className}>
      <div className="circle">
        <img alt="Metanaut" src={isObjective ? mtaImg : '/assets/icons/astroboi.gif'} />
      </div>
      <div className="banner">
        <div className="complete">{isObjective ? 'Quest Objective' : 'Quest'} Complete</div>
        <div className="details">
          {isObjective && <QP>{(points as number).toString()} QP</QP>}
          <div className="title">{title}</div>
        </div>
      </div>
    </Container>
  )
}
