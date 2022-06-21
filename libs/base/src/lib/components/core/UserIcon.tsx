import { useEffect, useRef } from 'react'

import Jazzicon from 'jazzicon'
import styled from 'styled-components'
import { useAccount } from 'wagmi'

import type { FC } from 'react'

export const UserIconContainer = styled.div`
  height: 1.25rem;
  width: 1.25rem;
  border-radius: 0.75rem;
  overflow: hidden;
`

export const UserIcon: FC<{ address?: string }> = ({ address }) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const { data: account } = useAccount()
  const userAddress = address ?? account?.address

  useEffect(() => {
    if (userAddress && ref.current) {
      ref.current.innerHTML = ''
      // eslint-disable-next-line new-cap
      ref.current.appendChild(Jazzicon(20, parseInt(userAddress.slice(2, 10), 16)))
    }
  }, [userAddress])

  return <UserIconContainer ref={ref} />
}
