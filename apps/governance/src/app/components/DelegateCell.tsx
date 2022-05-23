import { IPFSImg, UserIcon } from '@apps/base/components/core'
import { TableCell } from '@apps/dumb-components'
import { truncateAddress } from '@apps/formatters'
import styled from 'styled-components'

import type { DelegateeInfo } from '@mstable/delegatee-lists'
import type { FC } from 'react'

const DisplayName = styled.div<{ isTitleAddress: boolean }>`
  ${({ isTitleAddress, theme }) => isTitleAddress && theme.mixins.numeric};
`

const StyledDelegateeCell = styled(TableCell)`
  span {
    ${({ theme }) => theme.mixins.numeric};
  }

  .avatar {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    margin-right: 1rem;
    overflow: hidden;
    background-color: blueviolet;
    img {
      width: 100%;
      height: auto;
    }
  }

  > div {
    display: flex;
    align-items: center;
    gap: 1rem;

    &:first-child {
      margin-right: 1rem;
    }
  }
`

export const DelegateCell: FC<{ address: string; rank: number; delegatee?: DelegateeInfo; width: number }> = ({
  address,
  delegatee,
  rank,
  width,
}) => (
  <StyledDelegateeCell width={width}>
    <div>
      <span>{rank}</span>
    </div>
    <div className="avatar">{delegatee ? <IPFSImg uri={delegatee.avatarURI} /> : <UserIcon address={address} />}</div>
    <DisplayName isTitleAddress={!delegatee?.displayName}>{delegatee?.displayName ?? truncateAddress(address)}</DisplayName>
  </StyledDelegateeCell>
)
