import { truncateAddress } from '@apps/formatters'
import React, { FC, useCallback } from 'react'
import styled from 'styled-components'
import { useClipboard } from 'use-clipboard-copy'

import { ExplorerLink } from './ExplorerLink'
import { UnstyledButton } from './Button'

interface Props {
  address: string
  type: 'account' | 'transaction'
  copyable?: boolean
  truncate?: boolean
  link?: boolean
}

const Copy: FC<{ onClick(): void }> = ({ onClick }) => (
  <UnstyledButton onClick={onClick}>
    <svg width="14" height="13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 4H1v8h8V9m0 0h4V1H5v8h4z" stroke="#727272" />
    </svg>
  </UnstyledButton>
)

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'DM Mono', monospace;
`

export const Address: FC<Props> = ({ address, type, truncate = true, link = true, copyable }) => {
  const { copy, copied } = useClipboard({ copiedTimeout: 1500 })

  const handleCopy = useCallback(() => {
    copy(address)
  }, [copy, address])

  return (
    <Container>
      {link ? <ExplorerLink data={address} type={type} showData truncate={truncate} /> : truncate ? truncateAddress(address) : address}
      {copyable ? <Copy onClick={handleCopy}>{copied ? 'Copied!' : 'Copy'}</Copy> : null}
    </Container>
  )
}
