import React, { FC } from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { NavigationDropdown, NavItem } from '@apps/components/core'
import { useBaseCtx } from '../../Base'

import { useSelectedMassetName } from '../../context/MassetProvider'
import { useThemeMode } from '../../context/AppProvider'
import { colorTheme, ViewportWidth } from '@apps/base/theme'

const List = styled.div`
  display: flex;

  > div:first-child {
    display: inline-block;
  }
  a {
    display: none;
  }

  @media (min-width: ${ViewportWidth.l}) {
    > div:first-child {
      display: none;
    }
    > a {
      display: inline-block;
    }
  }
`

const StyledNavLink = styled(NavLink)`
  margin: 0 0.5rem;
  position: relative;
  font-weight: 600;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.color.body};
  white-space: nowrap;
`

// FIXME don't add massetName here
export const Navigation: FC = () => {
  const massetName = useSelectedMassetName()
  const themeMode = useThemeMode()
  const baseCtx = useBaseCtx()

  return (
    <nav>
      <List>
        <NavigationDropdown massetName={massetName} items={baseCtx[0].navItems} />
        {baseCtx[0].navItems.map(({ title, path }) => (
          <StyledNavLink activeStyle={{ color: colorTheme(themeMode).primary }} key={title} to={`/${massetName}${path}`}>
            {title}
          </StyledNavLink>
        ))}
      </List>
    </nav>
  )
}
