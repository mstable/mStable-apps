import { Button, Table, TableCell, TableRow } from '@apps/dumb-components'
import { ViewportWidth } from '@apps/theme'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import type { FC } from 'react'

const Header = styled.div`
  padding: 0 1rem;

  h3 {
    font-size: 1.25rem;
    color: ${({ theme }) => theme.color.body};
    margin-bottom: 0.75rem;
  }

  p {
    font-size: 0.875rem;
  }
`

const Container = styled.div`
  background: ${({ theme }) => theme.color.background[0]};
  color: ${({ theme }) => theme.color.body};
  padding: 0 1rem;

  > *:last-child {
    margin-top: 1rem;
  }

  h3 {
    font-weight: 500;
  }

  p,
  span {
    color: ${({ theme }) => theme.color.bodyAccent};
  }

  td {
    height: 5rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    width: 34rem;
    padding: 1.5rem 1rem 1.5rem;
    > *:not(:last-child) {
      margin-bottom: 0;
    }
  }
`

const getAssetUse = (symbol: string, type?: 'masset' | 'fasset' | 'basset'): { title: string; subtitle: string; href?: string }[] => {
  const isBtc = symbol.includes('BTC')
  const massetName = isBtc ? 'mbtc' : 'musd'
  const formattedName = {
    musd: 'mUSD',
    mbtc: 'mBTC',
  }

  switch (symbol) {
    case 'mUSD Save v1':
      return [
        {
          title: `Migrate`,
          subtitle: 'Migrate your Save balance',
          href: `/${massetName}/save`,
        },
      ]
    case 'mBTC':
    case 'mUSD':
      return [
        {
          title: `Save (i${formattedName[massetName]})`,
          subtitle: 'Earn a native interest rate',
          href: `/${massetName}/save`,
        },
        {
          title: 'Pools',
          subtitle: 'Earn MTA rewards',
          href: `/${massetName}/pools`,
        },
      ]
    case 'imUSD':
    case 'imBTC':
      return [
        {
          title: `Save Vault (i${formattedName[massetName]} Vault)`,
          subtitle: 'Earn MTA rewards',
          href: `/${massetName}/save`,
        },
      ]
    case 'MTA':
      return [
        {
          title: 'mStable Governance',
          subtitle: 'Stake MTA to vote in governance',
          href: 'https://staking.mstable.app/',
        },
        {
          title: 'Unit Protocol',
          subtitle: 'Use as collateral for loans',
          href: 'https://unit.xyz/',
        },
      ]
    default:
      return [
        {
          title: `Save (i${formattedName[massetName]})`,
          subtitle: 'Earn a native interest rate',
          href: `/${massetName}/save`,
        },
        {
          title: 'Pools',
          subtitle: 'Earn MTA rewards',
          href: `/${massetName}/pools`,
        },
      ]
  }
}

export const ExploreAsset: FC<{ symbol?: string; onRowClick?: () => void; type?: 'masset' | 'fasset' | 'basset' }> = ({
  symbol,
  type,
  onRowClick,
}) => {
  const assetUses = getAssetUse(symbol ?? '', type)
  const history = useHistory()

  const handleOnClick = (href?: string): void => {
    if (!href) return
    if (href.includes('http')) {
      window.open(href, '_blank')
    } else {
      history.push(href)
      onRowClick?.()
    }
  }

  return (
    <Container>
      <Header>
        <h3>Explore</h3>
        <p>Explore options to deposit your idle {symbol}</p>
      </Header>
      <Table>
        {assetUses.map(val => {
          if (!val) return null
          const { title, subtitle, href } = val
          return (
            <TableRow key={title} buttonTitle="View" onClick={() => handleOnClick(href)}>
              <TableCell width={75}>
                <div>
                  <h3>{title}</h3>
                  <span>{subtitle}</span>
                </div>
              </TableCell>
              <TableCell>
                <Button onClick={() => {}}>View</Button>
              </TableCell>
            </TableRow>
          )
        })}
      </Table>
    </Container>
  )
}
