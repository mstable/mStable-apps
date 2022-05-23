import { FontSize } from '@apps/theme'
import styled from 'styled-components'

/**
 * @deprecated
 */
export const H2 = styled.h2<{ center?: boolean }>`
  font-size: ${FontSize.l};
  font-weight: bold;
  line-height: 1.5rem;
  padding-top: 4px;
  padding-bottom: 12px;

  ${({ theme }) => theme.mixins.textAlign}
`

/**
 * @deprecated
 */
export const H3 = styled.h3`
  font-size: ${FontSize.l};
  line-height: 1.5rem;
  padding-bottom: 12px;
  padding-top: 4px;
`

/**
 * @deprecated
 */
export const H4 = styled.h4`
  font-size: 12px;
  text-transform: uppercase;
  font-weight: bold;
`
