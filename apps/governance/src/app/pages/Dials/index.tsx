import React, { useMemo, useState } from 'react'
import type { FC } from 'react'
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
  ThemedSkeleton,
} from '@apps/dumb-components'
import { ReactComponent as BackArrow } from '@apps/icons/back-arrow.svg'
import { ReactComponent as ForwardArrow } from '@apps/icons/forward-arrow.svg'

import { GovernancePageHeader } from '../../components/GovernancePageHeader'
import { DistributionBar } from './DistributionBar'
import { DialsProvider, useEmissionDialsContract, useEmissionDialsState } from './DialsProvider'
import { useToggle } from 'react-use'
import { useStakedTokenQuery } from '../../context/StakedTokenProvider'
import { ViewportWidth } from '@apps/theme'
import { usePropose } from '@apps/base/context/transactions'
import { TransactionManifest, Interfaces } from '@apps/transaction-manifest'
import { useEffect } from 'react'

const DOCS_URL = 'https://docs.mstable.org/using-mstable/mta-staking'
const FORUM_URL = 'https://forum.mstable.org/'

const TABLE_CELL_WIDTHS = [30, 25, 35]

const StyledSlider = styled(Slider)`
  height: 1rem;
`

const StyledSkeleton = styled(ThemedSkeleton)`
  width: 100%;
  border-radius: 1rem;
  > div {
    width: 100%;
    line-height: 0;
  }
`

const ArrowButton = styled(UnstyledButton)`
  svg {
    path {
      fill: ${({ theme }) => theme.color.body};
    }
  }
`

const LoadingRow = styled(TableRow)`
  width: 100%;
  padding: 0;
  > * {
    padding: 0;
    width: 100%;
  }
`

const Buttons = styled.div`
  display: flex;
  position: absolute;
  right: 0.75rem;
  top: -2.5rem;
  gap: 0.25rem;

  @media (min-width: ${ViewportWidth.s}) {
    top: 0.75rem;
  }
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

  > div {
    flex: 1;
  }

  > div:last-child {
    flex-direction: column;
  }

  > div:first-child:not(:last-child) {
    border: 1px solid ${({ theme }) => theme.color.defaultBorder};
    border-radius: 1rem;
  }

  @media (min-width: ${ViewportWidth.s}) {
    flex-direction: row;

    > div:last-child {
      flex-direction: row;
    }
  }

  @media (min-width: ${ViewportWidth.l}) {
    flex-direction: column;

    > div {
      flex: initial;
    }
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
  margin-top: 2rem;

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

  @media (min-width: ${ViewportWidth.s}) {
    margin-top: 0;
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
    gap: 0.5rem;
    flex-direction: column;
    text-align: center;
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

  @media (min-width: ${ViewportWidth.s}) {
    > :first-child {
      flex-direction: row;
      text-align: left;
      gap: 0;
    }
  }
`

const DialAndSidebar = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column-reverse;

  @media (min-width: ${ViewportWidth.l}) {
    gap: 0;
    justify-content: space-between;
    flex-direction: row;

    > div:first-child {
      flex-basis: calc(70% - 0.5rem);
    }

    > div:last-child {
      flex-basis: calc(30% - 0.5rem);
    }
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
    <DialsProvider>
      <DialsContent />
    </DialsProvider>
  )
}

const scaleUserDials = (dials: Record<string, number>): Record<string, number> => {
  if (!Object.values(dials ?? {}).length) return {}

  const nonZeroDials = Object.values(dials).filter(v => !!v)
  const cumulativeWeight = nonZeroDials.reduce((a, b) => a + b, 0)

  // Scale only if total > 100
  if (cumulativeWeight <= 100) return dials

  const weightMultiplier = cumulativeWeight / 100
  const scaledUserDials = Object.keys(dials)
    .map(k => ({ [k]: !!dials[k] ? Math.floor(dials[k] / weightMultiplier) : 0 }))
    .reduce((a, b) => ({ ...a, ...b }), {})

  // TODO: Improve logic
  // remainder gets added to highest value
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

const DialsContent: FC = () => {
  const { data: dials } = useEmissionDialsState()
  const contract = useEmissionDialsContract()
  const propose = usePropose()

  const { currentEpoch, dials: _systemDials, userDials: _userDials, emission, userVotePower } = dials

  const [epoch, setEpoch] = useState(0)
  const [userDials, setUserDials] = useState<Record<string, number>>(_userDials)
  const [isSystemView, toggleView] = useToggle(true)

  const epochRange = [currentEpoch, currentEpoch + 86400 * 7000]

  const headerTitles = isSystemView ? ['Dial', 'System %', ''].map(t => ({ title: t })) : ['Dial', 'User %', ''].map(t => ({ title: t }))

  const hasUserDialChanged = JSON.stringify(_userDials) !== JSON.stringify(userDials)

  const scaledDials = useMemo(() => scaleUserDials(userDials), [userDials])

  const handleSliderChange = (k: string, v: number) => setUserDials({ ...userDials, [k]: v })

  const handleWeightReset = () => setUserDials(_userDials)

  const handleSubmit = () => {
    if (!contract) return
    const keys = Object.keys(scaledDials)
    if (!keys.length) return

    const changedDials = keys.map(k => ({
      dialId: _systemDials.find(dial => dial.key === k).id,
      weight: scaledDials[k] * 2,
    }))

    propose<Interfaces.EmissionsController, 'setVoterDialWeights'>(
      new TransactionManifest(contract, 'setVoterDialWeights', [changedDials], {
        present: 'Voting for weights',
        past: 'Voted on weights',
      }),
    )
  }

  // FIXME:
  useEffect(() => {
    setUserDials(_userDials)
  }, [_userDials])

  return (
    <Container>
      <GovernancePageHeader title="Dials" subtitle="Vote on future MTA emissions" />
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
          {!_systemDials ? (
            <StyledSkeleton height={100} />
          ) : (
            <DistributionContainer>
              <DistributionBar dials={_systemDials} emission={emission} />
            </DistributionContainer>
          )}
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
              {!_systemDials?.length ? (
                <LoadingRow>
                  <TableCell>
                    <StyledSkeleton height={100} />
                  </TableCell>
                </LoadingRow>
              ) : (
                _systemDials?.map(({ title, value, key }) => (
                  <TableRow key={key}>
                    <TableCell width={TABLE_CELL_WIDTHS[0]}>
                      <h3>{title}</h3>
                    </TableCell>
                    <TableCell width={TABLE_CELL_WIDTHS[1]}>
                      <span>{isSystemView ? value : scaledDials[key] ?? 0}%</span>
                    </TableCell>
                    <TableCell width={TABLE_CELL_WIDTHS[2]}>
                      <StyledSlider
                        intervals={0}
                        min={0}
                        max={100}
                        step={1}
                        value={isSystemView ? value : userDials?.[key]}
                        disabled={isSystemView}
                        onChange={v => handleSliderChange(key, v)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </Table>
            {!isSystemView && (
              <SubmitContainer>
                <Warning />
                {!!userVotePower ? (
                  <>
                    <div>
                      <h3>Changes will take effect from the next epoch</h3>
                      <p>Your preferences will continue for future epochs until changed</p>
                    </div>
                    <Button disabled={!hasUserDialChanged} highlighted={hasUserDialChanged} onClick={handleSubmit}>
                      Submit
                    </Button>
                  </>
                ) : (
                  <div>
                    <h3>No voting power found</h3>
                    <p>Stake in governance and delegate to yourself to participate actively</p>
                  </div>
                )}
              </SubmitContainer>
            )}
          </DialContainer>
          <Sidebar>
            <BalanceWidget title="Voting Power" token="vMTA" balance={userVotePower?.simple} />
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
