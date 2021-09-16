import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { DelegateeInfo } from '@mstable/delegatee-lists'

import { Address, ExplorerLink, ExternalLink, IPFSImg, UserIcon } from '@apps/components/core'
import { ViewportWidth } from '@apps/base/theme'

import { DelegateeToggle } from '../pages/Vote/DelegateeToggle'
import { StakedTokenSwitcher } from './StakedTokenSwitcher'

interface Props {
  title: string
  icon?: JSX.Element
  subtitle?: string
  stakedTokenSwitcher?: boolean
  backTo?: string
  backTitle?: string
}

const Icon = styled.div<{ inverted?: boolean }>`
  display: flex;
  margin-right: 0.5rem;

  img,
  svg {
    width: 2.5rem;
    height: 2.5rem;

    * {
      fill: ${({ theme }) => theme.color.body};
    }
  }

  img + div {
    display: none;
  }
`

const BackArrow: FC = () => (
  <svg width="17" height="8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M.646 3.646a.5.5 0 000 .708l3.182 3.182a.5.5 0 00.708-.708L1.707 4l2.829-2.828a.5.5 0 10-.708-.708L.646 3.646zM17 3.5H1v1h16v-1z"
      fill="#9C9C9C"
    />
  </svg>
)

const BackLink = styled(Link)`
  color: ${({ theme }) => theme.color.bodyAccent};
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.5rem;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const ChildrenRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;

  @media (min-width: ${({ theme }) => theme.viewportWidth.s}) {
    flex-direction: row;
  }
`

const Container = styled.div<{
  messageVisible?: boolean
}>`
  display: flex;
  flex-direction: column;
  padding: 2rem 0 1rem;
  gap: 0.25rem;

  h2 {
    font-size: 1.75rem;
    line-height: 2.5rem;
    font-weight: 500;
  }

  p {
    padding: 0.25rem 0 0;
    font-size: 1rem;
    line-height: 1.5rem;
    max-width: 65ch;
    color: ${({ theme }) => theme.color.bodyAccent};
  }

  @media (min-width: ${ViewportWidth.s}) {
    padding: 3rem 0 1rem;
  }
`

export const GovernancePageHeader: FC<Props> = ({ children, title, subtitle, icon, stakedTokenSwitcher, backTitle, backTo }) => {
  return (
    <Container>
      {backTo && (
        <BackLink to={backTo}>
          <BackArrow />
          <span>{backTitle ?? 'Back'}</span>
        </BackLink>
      )}
      <Row>
        {icon && <Icon inverted>{icon}</Icon>}
        <h2>{title}</h2>
        {stakedTokenSwitcher && <StakedTokenSwitcher />}
      </Row>
      {subtitle && <p>{subtitle}</p>}
      {children && <ChildrenRow>{children}</ChildrenRow>}
    </Container>
  )
}

const UserDelegate = styled.div`
  :first-child {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    gap: 1rem;

    > :first-child {
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 50%;
      overflow: hidden;
      background: blueviolet;

      > img {
        width: 100%;
        height: auto;
      }

      > div {
        width: 100%;
        height: 100%;

        * {
          width: 100% !important;
          height: 100% !important;
        }
      }
    }

    > :last-child {
      min-height: 3.5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      > :first-child a {
        color: ${({ theme }) => theme.color.body};
      }

      > :last-child {
        font-size: 0.75rem;
        color: ${({ theme }) => theme.color.bodyAccent};
      }
    }
  }

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;

    :first-child {
      flex-direction: row;
      justify-content: flex-start;

      > :last-child {
        align-items: flex-start;
        justify-content: flex-start;

        > :last-child {
          font-size: 1rem;
        }
      }
    }
  }
`

const DelegateeContainer = styled(Container)`
  h3 {
    font-family: 'DM Mono', monospace;
    margin-bottom: 0;
  }

  ${Row} {
    gap: 1rem;
    justify-content: space-between;
    flex-direction: column;

    > :last-child {
      width: 100%;
    }

    @media (min-width: ${ViewportWidth.m}) {
      flex-direction: row;

      > :last-child {
        width: inherit;
      }
    }
  }
`

export const DelegateePageHeader: FC<{ delegateeInfo?: DelegateeInfo; addressOrENSName: string; address?: string }> = ({
  delegateeInfo,
  address,
  addressOrENSName,
}) => (
  <DelegateeContainer>
    <BackLink to="/vote/leaderboard">
      <BackArrow />
      <span>Leaderboard</span>
    </BackLink>
    <Row>
      <UserDelegate>
        <div>{delegateeInfo?.avatarURI ? <IPFSImg uri={delegateeInfo.avatarURI} /> : <UserIcon address={address} />}</div>
        <div>
          {delegateeInfo && (
            <h2>
              {delegateeInfo.profileURI ? (
                <ExternalLink href={delegateeInfo.profileURI}>
                  {delegateeInfo.displayName ?? delegateeInfo.ensName ?? delegateeInfo.address}
                </ExternalLink>
              ) : (
                delegateeInfo.displayName
              )}
            </h2>
          )}
          {!delegateeInfo && addressOrENSName !== address && <h2>{addressOrENSName}</h2>}
          <Address address={addressOrENSName} type="account" truncate={false} link={false} copyable />
        </div>
      </UserDelegate>
      <DelegateeToggle address={address} stakedTokenSwitcher />
    </Row>
  </DelegateeContainer>
)
