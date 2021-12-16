import React, { FC } from 'react'
import styled from 'styled-components'

import { Dropdown } from '@apps/base/components/core'
import { useSetStakedToken, useStakedToken } from '../context/StakedToken'

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

export const StakedTokenSwitcher: FC<{ className?: string }> = ({ className }) => {
  const { selected, options } = useStakedToken()
  const setStakedToken = useSetStakedToken()

  return <StyledDropdown className={className} onChange={setStakedToken} options={options} defaultOption={selected} />
}
