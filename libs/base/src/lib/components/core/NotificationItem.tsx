import { AchievementUnlocked } from '@apps/dumb-components'
import styled from 'styled-components'

import { NotificationType, useMarkNotificationAsRead } from '../../context/NotificationsProvider'

import type { FC } from 'react'

import type { Notification } from '../../context/NotificationsProvider'

const Title = styled.div`
  font-weight: 600;
  font-size: 0.85rem;
`

const Link = styled.a<{ nType: NotificationType }>`
  color: ${({ theme, nType }) => (nType === NotificationType.Success ? theme.color.black : theme.color.white)};
  border-top: 1px
    ${({ theme, nType }) => (nType === NotificationType.Success ? theme.color.blackTransparent : theme.color.whiteTransparent)} solid;
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  padding-top: 0.1rem;

  &:after {
    content: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAQElEQVR42qXKwQkAIAxDUUdxtO6/RBQkQZvSi8I/pL4BoGw/XPkh4XigPmsUgh0626AjRsgxHTkUThsG2T/sIlzdTsp52kSS1wAAAABJRU5ErkJggg==');
    margin: 0 3px 0 5px;
    filter: ${({ nType }) =>
      nType === NotificationType.Success ? 'none' : 'invert(99%) sepia(1%) saturate(2%) hue-rotate(39deg) brightness(100%) contrast(101%)'};
  }
`

const Body = styled.div`
  font-size: 0.75rem !important;
`

const Container = styled.div<Pick<Notification, 'type'> & { className?: string }>`
  background: ${({ theme, type }) =>
    type === NotificationType.Success ? theme.color.green : type === NotificationType.Info ? theme.color.primary : theme.color.red};
  color: ${({ theme, type }) => (type === NotificationType.Success ? theme.color.black : theme.color.white)};
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  transition: opacity 0.3s ease;
  cursor: pointer;
  text-align: right;

  > * {
    font-size: 0.85rem;
    &:not(:last-child) {
      margin-bottom: 0.2rem;
    }
  }

  &:hover {
    opacity: 0.5;
  }
`

// const NotificationItemQuestContainer = styled.div`
//   display: flex !important;
//   gap: 1rem;
//   align-items: center;
//   justify-content: space-between;

//   font-size: 0.875rem;
//   padding: 0.5rem 1rem;
//   border-radius: 2px;
//   border-color: rgb(201, 252, 213);
//   background: rgb(62, 78, 66);

//   > :first-child {
//     width: 1.5rem;
//     height: auto;
//   }

//   > :last-child {
//     > :last-child {
//       color: rgba(201, 252, 213, 1);
//     }
//   }

//   ${({ theme }) => theme.mixins.mono}
// `

export const NotificationItem: FC<{
  notification: Notification
  className?: string
}> = ({ notification, className }) => {
  const markAsRead = useMarkNotificationAsRead()

  const { id, type, link, body, title, questPoints } = notification

  const handleClick = () => {
    markAsRead(id)
  }

  return type === NotificationType.Quest ? (
    <AchievementUnlocked className={className} title={title} points={questPoints} onClick={handleClick} />
  ) : (
    <Container type={type} onClick={handleClick} className={className}>
      <Title>{title}</Title>
      {body && <Body>{body}</Body>}
      {link && (
        <Link nType={type} href={link.href} target="_blank" rel="noopener noreferrer">
          {link.title}
        </Link>
      )}
    </Container>
  )
}
