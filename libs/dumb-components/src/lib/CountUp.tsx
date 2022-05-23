import { useEffect, useRef } from 'react'

import { useIsDarkMode } from '@apps/browser-settings'
import { Color } from '@apps/theme'
import { useCountUp } from 'react-countup'
import styled from 'styled-components'

import type { FC } from 'react'
import type { CountUpProps } from 'react-countup'

interface Props extends CountUpProps {
  container?: FC
  highlight?: boolean
  highlightColor?: Color
  spaced?: boolean
}

const DEFAULT_DECIMALS = 2
const DEFAULT_DURATION = 1

const StyledSpan = styled.span<Pick<Props, 'highlight' | 'highlightColor'>>`
  color: ${({ highlight, highlightColor }) => (highlight && highlightColor ? highlightColor : 'inherit')};
  font-weight: normal;
`

const PrefixOrSuffix = styled.span`
  font-family: 'Poppins', sans-serif;
`

const Prefix = styled(PrefixOrSuffix)<{ spaced: boolean }>`
  margin-right: ${({ spaced }) => (spaced ? '0.5rem' : 0)};
`

const Suffix = styled(PrefixOrSuffix)<{ spaced: boolean }>`
  margin-left: ${({ spaced }) => (spaced ? '0.5rem' : 0)};
`

const Number = styled.span`
  ${({ theme }) => theme.mixins.numeric}
`

export const CountUp: FC<Props> = ({
  className,
  container: Container = StyledSpan,
  end,
  decimals = DEFAULT_DECIMALS,
  highlight,
  highlightColor,
  prefix,
  suffix,
  separator = ',',
  duration = DEFAULT_DURATION,
  formattingFn,
  spaced = false,
}) => {
  // eslint-disable-next-line no-restricted-globals
  const isValid = typeof end === 'number' && !isNaN(end)
  const prevEnd = useRef(isValid ? end : 0)

  const { countUp, update, pauseResume, start } = useCountUp({
    decimals,
    duration,
    end: isValid ? end : 0,
    separator,
    start: prevEnd.current,
    ...(formattingFn ? { formattingFn } : null),
    // ...(prefix ? { prefix } : null),
    // ...(suffix ? { suffix } : null),
  })

  useEffect(() => {
    if (isValid) {
      prevEnd.current = end
      update(end)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end, isValid])

  return (
    <Container className={className} highlight={highlight} highlightColor={highlightColor}>
      {prefix ? <Prefix spaced={spaced}>{prefix}</Prefix> : null}
      <Number>{isValid && countUp !== 'NaN' ? (typeof countUp === 'number' ? countUp.toFixed(decimals) : countUp) : '–'}</Number>
      {suffix ? <Suffix spaced={spaced}>{suffix}</Suffix> : null}
    </Container>
  )
}

export const DifferentialCountup: FC<
  Props & {
    prev?: number
  }
> = ({ prev, end, ...props }) => {
  const isDarkTheme = useIsDarkMode()
  const blue = isDarkTheme ? Color.coolBlue : Color.blue
  return (
    <CountUp
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      end={end}
      highlight
      highlightColor={typeof prev !== 'number' || typeof end !== 'number' || end === prev ? blue : end > prev ? Color.green : Color.red}
    />
  )
}

const CountUpUSDContainer = styled.div`
  > span {
    display: block;
  }
  span + span {
    color: ${({ theme }) => theme.color.bodyAccent};
  }
`

export const CountUpUSD: FC<Props & { price?: number; priceDecimals?: number }> = ({
  className,
  end,
  decimals,
  highlight,
  highlightColor,
  prefix,
  suffix,
  price,
  priceDecimals,
  formattingFn,
}) => (
  <CountUpUSDContainer className={className}>
    <CountUp
      end={end}
      decimals={decimals}
      highlight={highlight}
      highlightColor={highlightColor}
      prefix={prefix}
      suffix={suffix}
      formattingFn={formattingFn}
    />
    {price && (
      <>
        <CountUp end={end * price} decimals={priceDecimals} prefix="$" formattingFn={formattingFn} />
      </>
    )}
  </CountUpUSDContainer>
)
