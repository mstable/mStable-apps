import React, { FC, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { useLocation } from 'react-use'
import { useDataState } from '@apps/data-provider'
import { useSelectedMasset, useSelectedMassetName, useSetSelectedMassetName } from '@apps/masset-provider'
import { MassetName } from '@apps/types'
import { Dropdown } from './Dropdown'

const StyledDropdown = styled(Dropdown)`
  > *:first-child {
    box-shadow: 0px 1px 5px 0 rgba(0, 0, 0, 0.1);
    padding: 0.25rem 0.75rem 0.25rem 0.5rem;
    background: ${({ theme }) => !theme.isLight && theme.color.background[1]};
    border: ${({ theme }) => !theme.isLight && `1px solid ${theme.color.defaultBorder}`};
  }

  > *:first-child:hover {
    background: transparent;
  }

  > div:nth-child(2) > button {
    padding: 0.375rem 0.5rem;
  }

  * {
    margin-right: 0 !important;
  }

  > button > div:nth-child(2),
  > div > button > div:nth-child(2) {
    display: none;
  }

  @media (min-width: ${({ theme }) => theme.viewportWidth.l}) {
    > button > div {
      > div {
        display: flex;
      }
      margin-right: 0.5rem;
    }
    > div {
      min-width: 3.5rem;
      > button > div > div {
        display: flex;
      }
    }
  }
`

export const MassetSwitcher: FC<{ className?: string }> = ({ className }) => {
  const dataState = useDataState()
  const history = useHistory()
  const [selected, setMassetName] = useSelectedMasset()

  const options = useMemo<Record<string, { icon: { symbol: string; hideNetwork: boolean } }>>(
    () =>
      Object.fromEntries([
        ...Object.values(dataState).map(massetState => [
          massetState.token.symbol,
          {
            icon: {
              symbol: massetState.token.symbol,
              hideNetwork: true,
            },
          },
        ]),
      ]),
    [dataState],
  )

  // Handle the masset changing directly from the URL
  const setSelectedMassetName = useSetSelectedMassetName()
  const massetName = useSelectedMassetName()
  const location = useLocation()
  useEffect(() => {
    const massetNameInUrl = location.hash?.match(/^#\/(musd|mbtc)\//)?.[1] as MassetName | undefined
    if (massetNameInUrl && massetNameInUrl !== massetName) {
      setSelectedMassetName(massetNameInUrl)
    }
  }, [location, massetName, setSelectedMassetName])

  return (
    <StyledDropdown
      className={className}
      onChange={(selectedAddress?: string): void => {
        if (!selectedAddress) return

        const slug = Object.keys(options)
          .find(address => address === selectedAddress)
          ?.toLowerCase() as MassetName

        setMassetName(slug as MassetName)

        const tab = window.location.hash.split('/')[2]
        history.push(`/${slug}/${tab}`)
      }}
      options={options}
      defaultOption={dataState[selected]?.token?.symbol}
    />
  )
}
