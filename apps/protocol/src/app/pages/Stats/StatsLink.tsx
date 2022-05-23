import { Color, FontSize } from '@apps/theme'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import type { FC } from 'react'

const Container = styled.div`
  padding: 4px 8px;
  background: ${Color.white};
  border: 1px ${Color.blackTransparent} solid;
  display: inline-block;
  border-radius: 2px;
  font-size: ${FontSize.s};

  a {
    color: ${Color.offBlack};
    border-bottom: none;
    font-weight: bold;
  }
`

type Section = 'volumes' | 'totals' | 'basket' | 'save'

export const StatsLink: FC<{ section?: Section }> = () => (
  <Container>
    <Link to="/stats">
      <span role="img" aria-label="chart">
        📊
      </span>{' '}
      View analytics
    </Link>
  </Container>
)
