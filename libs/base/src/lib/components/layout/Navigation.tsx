import { useIsDarkMode } from '@apps/browser-settings'
import { colorTheme, ViewportWidth } from '@apps/theme'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { useBaseCtx } from '../../BaseProviders'
import { NavigationDropdown } from '../core'

import type { FC } from 'react'

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

  .active {
    div {
      display: none;
    }
  }
`

const New = styled.div<{ hide?: boolean }>`
  display: ${({ hide }) => (hide ? 'none' : 'block')};
  position: absolute;
  bottom: -0.675rem;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.625rem;
  color: ${({ theme }) => (theme.isLight ? `#bf4800` : `#ff9e71`)};
  opacity: 0.75;
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
  const [{ navItems: _navItems }] = useBaseCtx()
  const isDarkTheme = useIsDarkMode()

  const navItems = _navItems.filter(({ path }) => path !== '/')

  return (
    <Container>
      <NavigationDropdown navItems={_navItems} />
      <ul>
        {navItems.map(({ title, path }) => (
          <li key={path}>
            <StyledNavLink
              activeStyle={{ color: colorTheme(isDarkTheme).primary, background: colorTheme(isDarkTheme).navItemActive, fontWeight: 500 }}
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
              <New hide={title !== 'Dials'}>New</New>
              {title}
            </StyledNavLink>
          </li>
        ))}
      </ul>
    </Container>
  )
}
