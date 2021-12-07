import React, { FC } from 'react'
import styled from 'styled-components'

import { truncateAddress } from '@apps/formatters'
import { ViewportWidth } from '@apps/theme'
import { Address, IPFSImg, UserIcon } from '@apps/base/components/core'
import { ExternalLink, Tooltip } from '@apps/dumb-components'

import { useDelegateesAll } from '../../context/DelegateeListsProvider'

const Container = styled.div`
  padding: 1rem;
  border-radius: 0.875rem;
  background: ${({ theme }) => theme.color.background[0]};
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};

  h4 {
    padding-bottom: 0.5rem;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.color.bodyAccent};
  }

  > div {
    display: flex;
    gap: 1rem;
    align-items: center;

    > :first-child {
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

      > :first-child {
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
  }
`

export const DialDelegatee: FC<{ address: string }> = ({ address }) => {
  const { [address]: delegateeInfo } = useDelegateesAll()
  return (
    <Container>
      <h4>
        <Tooltip tip="You are currently delegating your voting; your delegatee's preferences will be displayed">Delegatee</Tooltip>
      </h4>
      <div>
        <div>{delegateeInfo?.avatarURI ? <IPFSImg uri={delegateeInfo.avatarURI} /> : <UserIcon address={address} />}</div>
        <div>
          {delegateeInfo && (
            <div>
              {delegateeInfo.profileURI ? (
                <ExternalLink href={delegateeInfo.profileURI}>
                  {delegateeInfo.displayName ?? delegateeInfo.ensName ?? truncateAddress(delegateeInfo.address)}
                </ExternalLink>
              ) : (
                delegateeInfo.displayName
              )}
            </div>
          )}
          <Address address={address} type="account" truncate link={false} copyable />
        </div>
      </div>
    </Container>
  )
}
