import React, { FC, useCallback } from 'react'
import styled from 'styled-components'
import { utils } from 'ethers'

import { ViewportWidth } from '@apps/theme'
import Medium from '@apps/icons/social/medium.svg'
import Github from '@apps/icons/social/github.svg'
import Discord from '@apps/icons/social/discord.svg'
import Twitter from '@apps/icons/social/twitter.svg'
import Email from '@apps/icons/social/email.svg'

import { ChainIds, useNetwork } from '../../context/NetworkProvider'
import { useIsMasquerading, useMasquerade } from '../../context/AccountProvider'

const Links = styled.ul`
  align-items: center;
  color: ${({ theme }) => theme.color.bodyAccent};

  b {
    color: ${({ theme }) => theme.color.body};
    font-weight: 500;
  }

  a {
    color: ${({ theme }) => theme.color.bodyAccent};
  }

  li {
    display: inline-block;
    margin-right: 0.75rem;
  }
`

const SocialIcons = styled(Links)`
  a {
    border-bottom: 0;
  }

  img {
    display: block;
    width: 24px;
    height: auto;
    opacity: 0.8;
    filter: sepia(0%) saturate(300%) brightness(250%);
  }
`

const Version = styled.div`
  font-size: 0.6rem;

  span {
    font-weight: bold;
  }
`

const Gubbins = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const MasqueradeContainer = styled.div<{ isMasquerading: boolean }>`
  width: 3px;
  height: 3px;
  user-select: none;
  cursor: crosshair;
  background: ${({ isMasquerading }) => (isMasquerading ? 'pink' : 'transparent')};
`

const Masquerade: FC<{}> = () => {
  const masquerade = useMasquerade()
  const isMasquerading = useIsMasquerading()

  const handleClick = useCallback(() => {
    if (isMasquerading) {
      masquerade()
    } else {
      // eslint-disable-next-line no-alert
      const inputAddress = window.prompt('View as account (read only)')

      masquerade(inputAddress && utils.isAddress(inputAddress) ? inputAddress.toLowerCase() : undefined)
    }
  }, [isMasquerading, masquerade])

  return <MasqueradeContainer isMasquerading={isMasquerading} onClick={handleClick} />
}

const Inner = styled.div`
  padding: 1rem;

  > div {
    width: 100%;
  }

  > div > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;

    @media (min-width: ${ViewportWidth.m}) {
      flex-direction: row;
      justify-content: space-between;
    }
  }
`

const Container = styled.div`
  display: grid;
  overflow-x: hidden;
  grid-template-columns:
    1fr
    min(1000px, 100%)
    1fr;

  > * {
    grid-column: 2;
  }

  border-top: 1px solid ${({ theme }) => theme.color.lightBorder};
`

const socialIcons = [
  { title: 'Github', icon: Github, href: 'https://github.com/mstable' },
  { title: 'Discord', icon: Discord, href: 'https://discord.gg/pgCVG7e' },
  { title: 'Twitter', icon: Twitter, href: 'https://twitter.com/mstable_' },
  { title: 'Medium', icon: Medium, href: 'https://medium.com/mstable' },
  { title: 'Email', icon: Email, href: 'mailto:info@mstable.org' },
]

export const Footer: FC = () => {
  const network = useNetwork()
  const isEthereum = [ChainIds.EthereumMainnet, ChainIds.EthereumKovan, ChainIds.EthereumGoerli, ChainIds.EthereumRopsten].find(
    n => n === network.chainId,
  )

  return (
    <Container>
      <Inner>
        <div>
          <div>
            <Links>
              <b>mStable</b> powered by{' '}
              {isEthereum ? <a href="https://ethereum.org/en/">Ethereum</a> : <a href="https://polygon.technology">Polygon</a>}
            </Links>
            <SocialIcons>
              {socialIcons.map(({ title, href, icon }) => (
                <li key={href}>
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    <img src={icon} alt={title} />
                  </a>
                </li>
              ))}
            </SocialIcons>
          </div>
          <Gubbins>
            <div>
              <Version />
              <Masquerade />
            </div>
          </Gubbins>
        </div>
      </Inner>
    </Container>
  )
}
