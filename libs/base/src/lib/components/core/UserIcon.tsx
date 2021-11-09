import React, { FC, useEffect, useRef } from 'react'
import Jazzicon from 'jazzicon'
import styled from 'styled-components'

import { useWalletAddress } from '../../context/AccountProvider'

const Container = styled.div`
  height: 1.25rem;
  width: 1.25rem;
  border-radius: 0.75rem;
`

export const UserIcon: FC<{ address?: string }> = ({ address }) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const walletAddress = useWalletAddress()
  const userAddress = address ?? walletAddress

  useEffect(() => {
    if (userAddress && ref.current) {
      ref.current.innerHTML = ''
      ref.current.appendChild(Jazzicon(20, parseInt(userAddress.slice(2, 10), 16)))
    }
  }, [userAddress])

  return <Container ref={ref} />
}
