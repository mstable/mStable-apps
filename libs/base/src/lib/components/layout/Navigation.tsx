import React, { FC } from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { NavigationDropdown } from '@apps/components/core'

import { useThemeMode } from '../../context/AppProvider'

import { colorTheme, ViewportWidth } from '../../theme'
import { useBaseCtx } from '../../BaseProviders'

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
  margin: 0 0.25rem;
  position: relative;
  font-weight: 400;
  font-size: 1rem;
  color: ${({ theme }) => theme.color.body};
  white-space: nowrap;
  padding: 0.25rem 0.5rem;
  border-radius: 0.675rem;
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
              activeStyle={{ color: colorTheme(themeMode).primary, background: colorTheme(themeMode).navItemActive, fontWeight: 500 }}
              to={path}
              isActive={(match, location) => {
                if (match?.path) return true

                const routeParts = location.pathname.split('/')
                const pathParts = path.split('/')

                if (routeParts.length === 2 && pathParts.length === 2) {
                  return routeParts[1] === pathParts[1]
                }

                return routeParts[2] === pathParts[2]
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
