import React, { FC } from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { NavigationDropdown } from '@apps/components/core'

import { useThemeMode } from '../../context/AppProvider'

import { colorTheme, ViewportWidth } from '../../theme'
import { useBaseCtx } from '../../Base'

const Container = styled.nav`
  > :first-child {
    display: block;
  }
  > :last-child {
    display: none;
  }

  @media (min-width: ${ViewportWidth.l}) {
    > :first-child {
      display: none;
    }
    > :last-child {
      display: flex;
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

export const Navigation: FC = () => {
  const [{ navItems }] = useBaseCtx()
  const themeMode = useThemeMode()

  return (
    <Container>
      <NavigationDropdown navItems={navItems} />
      <ul>
        {navItems.map(({ title, path }) => (
          <li key={path}>
            <StyledNavLink
              activeStyle={{ color: colorTheme(themeMode).primary }}
              to={path}
              isActive={(match, location) => {
                if (match?.path) return true

                // TODO assumption, may not work for future routes
                return location.pathname.split('/')[2] === path.split('/')[2]
              }}
            >
              {title}
            </StyledNavLink>
          </li>
        ))}
      </ul>
    </Container>
  )
}
