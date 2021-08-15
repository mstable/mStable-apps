import React, { FC } from 'react'
import styled from 'styled-components'

import { Dropdown } from '@apps/components/core'
import { useSetStakedToken, useStakedToken } from '../context/StakedTokenProvider'

const StyledDropdown = styled(Dropdown)`
  > *:first-child {
    background: ${({ theme }) => theme.color.background[1]};
  }

  > *:first-child:hover {
    background: ${({ theme }) => theme.color.background[2]};
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

export const StakedTokenSwitcher: FC = () => {
  const { selected, options } = useStakedToken()
  const setStakedToken = useSetStakedToken()

  return <StyledDropdown onChange={setStakedToken} options={options} defaultOption={selected} />
}
