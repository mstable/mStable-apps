import React, { FC } from 'react'
import styled from 'styled-components'
import { DelegateeInfo } from '@mstable/delegatee-lists'

import { ViewportWidth } from '@apps/theme'
import { IPFSImg, UserIcon } from '@apps/base/components/core'
import { Address } from '@apps/base/components/core'
import { BackLink, ExternalLink } from '@apps/dumb-components'

import { DelegateeToggle } from '../pages/Vote/DelegateeToggle'

interface Props {
  delegateeInfo?: DelegateeInfo
  addressOrENSName: string
  address?: string
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
        justify-content: center;

        > :last-child {
          font-size: 1rem;
        }
      }
    }
  }
`

const Row = styled.div`
  display: flex;

  > *:first-child:not(:last-child) {
    margin-right: 1rem;
  }
`

const Container = styled.div<{
  messageVisible?: boolean
}>`
  display: flex;
  flex-direction: column;
  padding: 2rem 0 1rem;
  gap: 0.25rem;
  text-align: center;
  border-radius: 1rem;

  h2 {
    font-size: 1.75rem;
    line-height: 2.5rem;
    font-weight: 500;
  }

  p {
    padding: 0.25rem 0 0;
    font-size: 0.875rem;
    line-height: 1.25rem;
    max-width: 60ch;
    color: ${({ theme }) => theme.color.bodyAccent};
  }

  @media (min-width: ${ViewportWidth.s}) {
    margin: 1rem 0;
    padding: 1.5rem 0;
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

export const DelegateePageHeader: FC<Props> = ({ delegateeInfo, address, addressOrENSName }) => (
  <DelegateeContainer>
    <BackLink to="/vote/leaderboard" title="Leaderboard" />
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
