import React, { FC } from 'react'
import styled from 'styled-components'

import { IPFSImg, UserIcon } from '@apps/base/components/core'
import { Button, UnstyledButton } from '@apps/dumb-components'
import { truncateAddress } from '@apps/formatters'
import { useModalData } from '@apps/base/context/modal-data'
import { ViewportWidth } from '@apps/theme'

import { useDelegationModal } from '../hooks/useDelegationModal'
import { useDelegateesAll } from '../context/DelegateeLists'
import { StakedTokenToggle } from './StakedTokenToggle'

interface Props {
  className?: string
  handleDelegate: (address: string) => void
}

const Address = styled.div`
  span {
    ${({ theme }) => theme.mixins.numeric};
    font-weight: 300;
    font-size: 1rem;
  }
`

const User = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  align-items: flex-start;

  * {
    line-height: 1rem;
  }

  h3 {
    font-size: 1rem;
  }

  span {
    ${({ theme }) => theme.mixins.numeric};
    font-weight: 300;
    font-size: 0.75rem;
  }
`

const Info = styled(UnstyledButton)`
  display: flex;
  align-items: center;
  flex: 1;
  gap: 0.5rem;
  border-radius: 0.75rem;
  margin-right: 0.5rem;
  min-width: 10rem;
  width: 100%;

  > div:first-child {
    height: 2rem;
    width: 2rem;

    * {
      border-radius: 50%;
      overflow: hidden;
      width: 100% !important;
      height: 100% !important;
    }
  }
`

const Delegation = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  line-height: 3rem;
`

const Container = styled.div`
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  display: flex;
  gap: 0.25rem;
  border-radius: 1rem;
  justify-content: space-between;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.5rem;

  > h3,
  button {
  }

  > h3 {
    margin-left: 0.25rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    padding: 0;
    flex-direction: row;
    align-items: inherit;
  }
`

export const DelegateSelectionAlt: FC<Props> = ({ className, handleDelegate }) => {
  const [showModal] = useDelegationModal()
  const { delegateSelection: delegatee } = useModalData()
  const delegateesAll = useDelegateesAll()
  const delegateeInfo = delegateesAll[delegatee]

  return (
    <Container className={className}>
      {delegatee ? (
        <Delegation>
          <Info onClick={showModal}>
            <div>{delegateeInfo ? <IPFSImg uri={delegateeInfo.avatarURI} /> : <UserIcon address={delegatee} />}</div>
            {delegateeInfo ? (
              <User>
                <h3>{delegateeInfo?.displayName}</h3>
                <span>{delegateeInfo?.ensName ?? truncateAddress(delegatee)}</span>
              </User>
            ) : (
              <Address>
                <span>{delegateeInfo?.ensName ?? truncateAddress(delegatee)}</span>
              </Address>
            )}
          </Info>
          <Button onClick={() => handleDelegate(delegatee)}>Delegate</Button>
        </Delegation>
      ) : (
        <Button onClick={showModal}>Select Delegate</Button>
      )}
      <StakedTokenToggle />
    </Container>
  )
}
