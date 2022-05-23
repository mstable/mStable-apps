import { TransactionStatus } from '@apps/transaction-manifest'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import styled, { css, keyframes } from 'styled-components'

import { NotificationType, useNotificationsState } from '../../context/NotificationsProvider'
import { useTransactionsState } from '../../context/TransactionsProvider'
import { NotificationItem } from '../core'
import { PendingTransaction } from '../wallet/PendingTransactions'
import { TransactionGasProvider } from '../wallet/TransactionGasProvider'

import type { FC } from 'react'
import type { TransitionProps } from 'react-transition-group/Transition'

const slideIn = keyframes`
  0% {
    transform: translateY(-1000px) scaleY(2.5) scaleX(0.2);
    transform-origin: 50% 0;
    filter: blur(40px);
    opacity: 0;
  }
  100% {
    transform: translateY(0) scaleY(1) scaleX(1);
    transform-origin: 50% 50%;
    filter: blur(0);
    opacity: 1;
  }
`

const questIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(1);
  }
  15% {
    opacity: 1;
    transform: scale(1.25);
  }
  40% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`

const questOut = keyframes`
  0% {
    opacity: 1;
    transform: scale(1);
    height: 4rem;
  }
  100% {
    transform: scale(0);
    height: 0;
    opacity: 0;
  }
`

const Container = styled.div`
  position: fixed;
  top: 4.5rem;
  right: 1rem;
  width: 20%;
  min-width: 280px;
  z-index: 2;
  user-select: none;
  > * {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    > * {
      display: inline-block;
      margin-bottom: 0.5rem;
    }
  }
`

const Animation = styled(CSSTransition)<{ isQuest?: boolean; classNames: string } & TransitionProps>`
  ${({ classNames, isQuest }) => css`
    &.${classNames}-enter {
      animation: ${isQuest
        ? css`
            ${questIn} 1s cubic-bezier(0.19, 1, 0.22, 1) normal
          `
        : css`
            ${slideIn} .4s cubic-bezier(0.19, 1, 0.22, 1) normal
          `};
    }
  `}

  ${({ classNames, isQuest }) => css`
    &.${classNames}-exit-active {
      animation: ${isQuest
        ? css`
            ${questOut} 1s cubic-bezier(0.19, 1, 0.22, 1) normal
          `
        : css`
            ${slideIn} .2s cubic-bezier(0.19, 1, 0.22, 1) reverse
          `};
    }
  `}
`

const TIMEOUT = {
  quest: { enter: 900, exit: 900 },
  default: { enter: 350, exit: 150 },
}

export const Toasts: FC = () => {
  const notifications = useNotificationsState()
  const txs = useTransactionsState()

  return (
    <Container>
      <TransitionGroup>
        {Object.keys(txs)
          .filter(id => txs[id].status === TransactionStatus.Pending || txs[id].status === TransactionStatus.Sent)
          .sort((a, b) => txs[b].manifest.createdAt - txs[a].manifest.createdAt)
          .map(id => (
            <Animation timeout={TIMEOUT.default} classNames="item" key={id}>
              <div>
                <TransactionGasProvider id={id}>
                  <PendingTransaction id={id} />
                </TransactionGasProvider>
              </div>
            </Animation>
          ))}
        {notifications
          .filter(n => !(n.hideToast || n.read))
          .map(notification => (
            <Animation
              isQuest={notification.type === NotificationType.Quest}
              timeout={notification.type === NotificationType.Quest ? TIMEOUT.quest : TIMEOUT.default}
              classNames="item"
              key={notification.id}
            >
              <NotificationItem notification={notification} />
            </Animation>
          ))}
      </TransitionGroup>
    </Container>
  )
}
