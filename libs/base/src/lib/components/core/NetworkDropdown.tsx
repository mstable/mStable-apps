/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { useCallback, useMemo } from 'react'

import { APP_NAME } from '@apps/types'
import { useKeyPress } from 'react-use'
import styled from 'styled-components'
import { useNetwork } from 'wagmi'

import { useBaseCtx } from '../../BaseProviders'
import { ChainIds, NETWORKS, useChainIdCtx } from '../../context/NetworkProvider'
import { Dropdown } from './Dropdown'

import type { FC } from 'react'

const StyledDropdown = styled(Dropdown)`
  > *:first-child {
    background: ${({ theme }) => theme.color.background[1]};
  }

  > *:first-child:hover {
    background: ${({ theme }) => theme.color.background[2]};
  }

  * {
    font-size: 1rem;
  }
  p {
    font-size: 0.875rem;
  }
`

export const NetworkDropdown: FC<{ onSwitch?: () => void }> = ({ onSwitch }) => {
  const [chainId, setChainId] = useChainIdCtx()
  const [isAltPressed] = useKeyPress('Alt')
  const [{ appName }] = useBaseCtx()
  const { switchNetwork } = useNetwork()

  const isGovernance = appName === APP_NAME.GOVERNANCE

  const handleSelect = useCallback(
    (_chainId?: string) => {
      const parsed = parseInt(_chainId ?? '0')
      if (switchNetwork) {
        switchNetwork(parsed)
      }
      setChainId(parsed)
      if (onSwitch) onSwitch()
    },
    [onSwitch, setChainId, switchNetwork],
  )

  const filteredNetworks = isGovernance
    ? NETWORKS.filter(({ chainId }) => ![ChainIds.MaticMainnet, ChainIds.MaticMumbai].includes(chainId))
    : NETWORKS

  const options = useMemo<Record<string, { icon: { symbol: string; hideNetwork: boolean }; subtext?: string }>>(
    () =>
      Object.fromEntries(
        filteredNetworks
          .filter(({ isTestnet, chainId: _chainId }) => _chainId === chainId || !isTestnet || isAltPressed)
          .map(({ protocolName, chainName, chainId: _chainId, isTestnet }) => [
            _chainId,
            {
              icon: { symbol: protocolName, hideNetwork: true },
              subtext: isTestnet ? chainName : undefined,
            },
          ]),
      ),
    [chainId, isAltPressed, filteredNetworks],
  )

  return <StyledDropdown onChange={handleSelect} options={options} defaultOption={chainId?.toString()} />
}
