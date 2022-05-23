import { useCallback } from 'react'

import { TokenIcon } from '@apps/base/components/core'
import { NETWORKS, Networks, useChainIdCtx } from '@apps/base/context/network'
import { UnstyledButton } from '@apps/dumb-components'
import styled from 'styled-components'

import type { ChainIds } from '@apps/base/context/network'
import type { FC } from 'react'

interface ItemProps {
  onClick: (network: string) => void
  protocolName: Networks
  isSelected: boolean
}

const Item = styled(UnstyledButton)<{ isSelected: boolean }>`
  background: ${({ isSelected, theme }) => isSelected && theme.color.background[2]};
  border-radius: 1.5rem;
  padding: 0.5rem 0.5rem;

  * {
    width: 2rem;
    height: 2rem;
  }

  &:hover {
    background: ${({ theme }) => theme.color.background[1]};
  }
`

const Container = styled.div`
  padding: 0.25rem 1rem;
  margin-top: 1.5rem;
  border-radius: 2rem;
  border: ${({ theme }) => theme.color.defaultBorder} 1px solid;

  > * {
    margin: 0 0.25rem;
  }
`

const NetworkItem: FC<ItemProps> = ({ protocolName, isSelected, onClick }) => {
  const chainId = NETWORKS.find(({ protocolName: _protocolName }) => _protocolName === protocolName)?.chainId?.toString()
  const handleSelect = () => onClick(chainId)

  return (
    <Item isSelected={isSelected} onClick={handleSelect}>
      <TokenIcon symbol={protocolName?.toString()} />
    </Item>
  )
}

export const NetworkSwitcher: FC = () => {
  const [chainId, setChainId] = useChainIdCtx()
  const protocolName = NETWORKS.find(({ chainId: _chainId }) => _chainId === chainId)?.protocolName

  const handleSelect = useCallback(
    (_chainId: string) => {
      const parsed = parseInt(_chainId)
      setChainId(parsed > 0 ? (parsed as ChainIds) : 1)
    },
    [setChainId],
  )

  return (
    <Container>
      {[Networks.Ethereum, Networks.Polygon].map(network => (
        <NetworkItem key={network.toString()} protocolName={network} isSelected={protocolName === network} onClick={handleSelect} />
      ))}
    </Container>
  )
}
