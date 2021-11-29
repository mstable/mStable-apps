import React, { FC, useMemo, useState } from 'react'
import styled from 'styled-components'
import { format } from 'date-fns'

import {
  Table,
  TableRow,
  TableCell,
  UnstyledButton,
  Slider,
  Button,
  Warning,
  BalanceWidget,
  InfoBox,
  ButtonExternal,
} from '@apps/dumb-components'
import { ReactComponent as BackArrow } from '@apps/icons/back-arrow.svg'
import { ReactComponent as ForwardArrow } from '@apps/icons/forward-arrow.svg'

import { GovernancePageHeader } from '../../components/GovernancePageHeader'
import { DistributionBar } from './DistributionBar'
import { DialsMockProvider, useMockDialsState } from './DialsMockProvider'
import { useToggle } from 'react-use'
import { useStakedTokenQuery } from '../../context/StakedTokenProvider'

const DOCS_URL = 'https://docs.mstable.org/using-mstable/mta-staking'
const FORUM_URL = 'https://forum.mstable.org/'

const TABLE_CELL_WIDTHS = [30, 25, 35]

const StyledSlider = styled(Slider)`
  height: 1rem;
`

const ArrowButton = styled(UnstyledButton)`
  svg {
    path {
      fill: ${({ theme }) => theme.color.body};
    }
  }
`

const Buttons = styled.div`
  display: flex;
  position: absolute;
  right: 0.75rem;
  top: 0.75rem;
  gap: 0.25rem;
`

const StyledButton = styled(Button)`
  height: 2.125rem;
  padding: 0.25rem 0.75rem;
  display: flex;
  align-items: center;
  background: ${({ highlighted, theme }) => !highlighted && theme.color.background[0]};
  border: ${({ highlighted, theme }) => !highlighted && `1px solid ${theme.color.defaultBorder}`};
`

const DistributionContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  background: ${({ theme }) => theme.color.background[0]};
  padding: 1rem;
  border-radius: 0.75rem;
  gap: 1rem;
`

const SubmitContainer = styled.div`
  display: flex;
  padding: 1rem;
  border-radius: 0.875rem;
  background: ${({ theme }) => theme.color.background[0]};
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  align-items: center;

  > div:nth-child(2) {
    flex: 1;
    margin-left: 0.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  > div:last-child {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  h3 {
    font-size: 1rem;
    color: ${({ theme }) => theme.color.body};
  }

  p {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.color.bodyAccent};
  }
`

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  > div:first-child:not(:last-child) {
    border: 1px solid ${({ theme }) => theme.color.defaultBorder};
    border-radius: 1rem;
  }

  > div:last-child {
    flex-direction: row;
  }
`

const DialContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 0.875rem;
  position: relative;
  gap: 0.5rem;
  background: ${({ theme }) => theme.color.background[1]};
  padding: 0.75rem;

  tbody {
    background: ${({ theme }) => theme.color.background[0]};

    h3 {
      font-weight: 500;
    }

    span {
      ${({ theme }) => theme.mixins.numeric};
      color: ${({ theme }) => theme.color.body};
      font-weight: 300;
    }
  }
`

const EpochContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  border-radius: 1rem;
  background: ${({ theme }) => theme.color.background[1]};
  padding: 0.75rem;

  > :first-child {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0.25rem 0.875rem 0.75rem;

    span {
      ${({ theme }) => theme.mixins.numeric};
    }

    h3 {
      color: ${({ theme }) => theme.color.body};
      font-size: 1.125rem;
      font-weight: 500;
    }
  }
`

const DialAndSidebar = styled.div`
  display: flex;
  justify-content: space-between;

  > div:first-child {
    flex-basis: calc(70% - 0.5rem);
  }

  > div:last-child {
    flex-basis: calc(30% - 0.5rem);
  }
`

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Container = styled.div``

export const Dials: FC = () => {
  return (
    <DialsMockProvider>
      <DialsContent />
    </DialsMockProvider>
  )
}

// Scaled to retrieve values (progress bars are 0-100)
const scaleUserDials = (dials: Record<string, number>): Record<string, number> => {
  const nonZeroDials = Object.values(dials).filter(v => !!v)
  const weightMultiplier = nonZeroDials.reduce((a, b) => a + b, 0) / 100
  const scaledUserDials = Object.keys(dials)
    .map(k => ({ [k]: !!dials[k] ? Math.floor(dials[k] / weightMultiplier) : 0 }))
    .reduce((a, b) => ({ ...a, ...b }), {})

  // remainder gets added to highest value
  // TODO: Improve logic
  const remainder = 100 - Object.values(scaledUserDials).reduce((a, b) => a + b)
  if (remainder > 0) {
    const values = Object.values(scaledUserDials)
    const scaledHighestKey = Object.keys(scaledUserDials).find(k => scaledUserDials[k] === Math.max(...values))
    const correctedForRemainder = Object.keys(scaledUserDials)
      .map(k => ({
        [k]: scaledUserDials[k] + (k === scaledHighestKey ? remainder : 0),
      }))
      .reduce((a, b) => ({ ...a, ...b }))
    return correctedForRemainder
  }
  return scaledUserDials
}

// Unsure how gas intensive the submit call is so this optionally reduces dial changes to ones that have had the largest change.
// ie. 8 changed -> 3 changed => less loops in func call
// scale data up -> optimize -> scale data back -> setUserDials()
const optimizeUserDials = (oldDials: Record<string, number>, scaledDials: Record<string, number>) => {
  const buffer = 5
  console.log(oldDials, scaledDials)
  const mappedDiffs = Object.keys(scaledDials).map(k =>
    scaledDials[k] < oldDials[k] + buffer && scaledDials[k] > oldDials[k] - buffer ? 0 : scaledDials[k] - oldDials[k],
  )
  const nonZeroDiffIndices = mappedDiffs.map((v, i) => (v !== 0 ? i : undefined)).filter(v => !!v)
  const splitRemainder = Math.floor(mappedDiffs.reduce((a, b) => a + b, 0) / nonZeroDiffIndices.length)
  const mappedDials = Object.keys(oldDials)
    .map((k, i) => ({ [k]: nonZeroDiffIndices.includes(i) ? scaledDials[k] + splitRemainder : oldDials[k] }))
    .reduce((a, b) => ({ ...a, ...b }))
  // console.log(mappedDials)

  return mappedDials
}

const DialsContent: FC = () => {
  const { data } = useStakedTokenQuery()
  const { currentEpoch, dials, userDials: _userDials, emission } = useMockDialsState()
  const [epoch, setEpoch] = useState(0)
  const [userDials, setUserDials] = useState<Record<string, number>>(_userDials)
  const [isSystemView, toggleView] = useToggle(true)

  const votingPower = data?.stakedToken?.accounts?.[0]?.balance?.rawBD?.simple

  const epochRange = [currentEpoch, currentEpoch + 86400 * 7000]

  const headerTitles = isSystemView ? ['Dial', 'System %', ''].map(t => ({ title: t })) : ['Dial', 'User %', ''].map(t => ({ title: t }))

  const hasUserDialChanged = JSON.stringify(_userDials) !== JSON.stringify(userDials)

  const scaledDials = useMemo(() => scaleUserDials(userDials), [userDials])

  const handleSliderChange = (k: string, v: number) => setUserDials({ ...userDials, [k]: v })

  const handleWeightReset = () => setUserDials(_userDials)

  const handleSubmit = () => {
    // Might need to add lock to dials to make it more gas efficient,
    // or add change buffer -> < ~5 change = no effect & subtract from the main dial change
    const sum = Object.values(scaledDials).reduce((a, b) => a + b)
    if (sum < 100) return
    const filteredDialKeys = Object.keys(scaledDials).filter(k => scaledDials[k] !== _userDials[k])
    const changedDials = filteredDialKeys.map(k => ({ dialId: dials.find(dial => dial.key === k).id, weight: scaledDials[k] * 2 }))
  }

  return (
    <Container>
      <GovernancePageHeader title="Dials" subtitle="Vote on future MTA emissions" stakedTokenSwitcher />
      <Inner>
        <EpochContainer>
          <div>
            <h3>Current Epoch</h3>
            <div>
              <ArrowButton onClick={() => setEpoch(epoch - 1)}>
                <BackArrow />
              </ArrowButton>
              <span>{`(${format(epochRange[0], 'dd/MM')} - ${format(epochRange[1], 'dd/MM')})`}</span>
              <ArrowButton onClick={() => setEpoch(epoch + 1)}>
                <ForwardArrow />
              </ArrowButton>
            </div>
          </div>
          <DistributionContainer>
            <DistributionBar dials={dials} emission={emission} />
          </DistributionContainer>
        </EpochContainer>
        <DialAndSidebar>
          <DialContainer>
            <Buttons>
              {!isSystemView && (
                <StyledButton scale={0.875} highlighted={isSystemView} onClick={handleWeightReset}>
                  Reset
                </StyledButton>
              )}
              <StyledButton scale={0.875} highlighted={isSystemView} onClick={toggleView}>
                {isSystemView ? `Vote on weights` : `Back`}
              </StyledButton>
            </Buttons>
            <Table headerTitles={headerTitles} widths={TABLE_CELL_WIDTHS}>
              {dials.map(({ title, value, key }) => (
                <TableRow key={key}>
                  <TableCell width={TABLE_CELL_WIDTHS[0]}>
                    <h3>{title}</h3>
                  </TableCell>
                  <TableCell width={TABLE_CELL_WIDTHS[1]}>
                    <span>{isSystemView ? value : scaledDials[key]}%</span>
                  </TableCell>
                  <TableCell width={TABLE_CELL_WIDTHS[2]}>
                    <StyledSlider
                      intervals={0}
                      min={0}
                      max={100}
                      step={1}
                      value={isSystemView ? value : userDials[key]}
                      disabled={isSystemView}
                      onChange={v => handleSliderChange(key, v)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </Table>
            {!isSystemView && (
              <SubmitContainer>
                <Warning />
                <div>
                  <h3>Changes will take effect from the next epoch</h3>
                  <p>Your preferences will continue for future epochs until changed</p>
                </div>
                <Button disabled={!hasUserDialChanged} highlighted={hasUserDialChanged} onClick={handleSubmit}>
                  Submit
                </Button>
                <div>
                  <Button disabled={!hasUserDialChanged} onClick={handleOptimize}>
                    Optimize
                  </Button>
                  <Button disabled={!hasUserDialChanged} highlighted={hasUserDialChanged} onClick={handleSubmit}>
                    Submit
                  </Button>
                </div>
              </SubmitContainer>
            )}
          </DialContainer>
          <Sidebar>
            <BalanceWidget title="Voting Power" token="vMTA" balance={votingPower} />
            <InfoBox>
              <ButtonExternal onClick={() => window.open(DOCS_URL)}>Docs</ButtonExternal>
              <ButtonExternal onClick={() => window.open(FORUM_URL)}>Forum</ButtonExternal>
            </InfoBox>
          </Sidebar>
        </DialAndSidebar>
      </Inner>
    </Container>
  )
}
