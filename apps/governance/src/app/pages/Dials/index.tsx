import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { format } from 'date-fns'

import { Table, TableRow, TableCell, UnstyledButton, Slider, Button } from '@apps/dumb-components'
import { ReactComponent as BackArrow } from '@apps/icons/back-arrow.svg'
import { ReactComponent as ForwardArrow } from '@apps/icons/forward-arrow.svg'

import { GovernancePageHeader } from '../../components/GovernancePageHeader'
import { DistributionBar } from './DistributionBar'
import { DialsMockProvider, useMockDialsState } from './DialsMockProvider'
import { useToggle } from 'react-use'

const TABLE_CELL_WIDTHS = [30, 30, 30]

const ArrowButton = styled(UnstyledButton)`
  margin: 0 0.5rem;
`

const StyledSlider = styled(Slider)`
  height: 1rem;
`

const DistributionContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.color.background[1]};
  padding: 1rem;
  border-radius: 0.75rem;
  gap: 1rem;
`

const DialContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  background: ${({ theme }) => theme.color.background[1]};
  padding: 1rem;
  border-radius: 0.875rem;
  position: relative;

  > button {
    position: absolute;
    right: 1rem;
    top: 0.5rem;
  }

  tbody {
    background: white;

    span {
      ${({ theme }) => theme.mixins.numeric};
      color: ${({ theme }) => theme.color.body};
      font-weight: 300;
    }
  }
`

const StyledButton = styled(Button)`
  height: 2.25rem;
  display: flex;
  align-items: center;
  background: ${({ highlighted }) => !highlighted && 'white'};
  border: ${({ highlighted, theme }) => !highlighted && `1px solid ${theme.color.defaultBorder}`};
`

const EpochContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  border-radius: 0.875rem;
  padding: 1rem;
  gap: 1rem;

  > :first-child {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    span {
      ${({ theme }) => theme.mixins.numeric};
    }
  }

  h3 {
    color: ${({ theme }) => theme.color.body};
    font-size: 1.125rem;
    font-weight: 500;
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

const DialsContent: FC = () => {
  const { currentEpoch, dials, emission } = useMockDialsState()
  const epochRange = [currentEpoch, currentEpoch + 86400 * 7000]

  const [epoch, setEpoch] = useState(0)
  const [isSystemView, toggleView] = useToggle(true)

  const headerTitles = isSystemView
    ? ['Dial', 'System Weight %', ''].map(t => ({ title: t }))
    : ['Dial', 'User Weight %', ''].map(t => ({ title: t }))

  const onSliderChange = () => {}

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
          <DistributionContainer>
            <DistributionBar dials={dials} emission={emission} />
          </DistributionContainer>
        </EpochContainer>
        <DialContainer>
          <StyledButton scale={0.875} highlighted={isSystemView} onClick={toggleView}>
            {isSystemView ? `Vote on weights` : `Back`}
          </StyledButton>
          <Table headerTitles={headerTitles} widths={TABLE_CELL_WIDTHS}>
            {dials.map(({ title, value, key }) => (
              <TableRow key={key}>
                <TableCell width={TABLE_CELL_WIDTHS[0]}>
                  <h3>{title}</h3>
                </TableCell>
                <TableCell width={TABLE_CELL_WIDTHS[1]}>
                  <span>{value}%</span>
                </TableCell>
                <TableCell width={TABLE_CELL_WIDTHS[2]}>
                  <StyledSlider
                    intervals={0}
                    min={0}
                    max={100}
                    step={1}
                    value={value}
                    disabled={isSystemView}
                    onChange={(!isSystemView && onSliderChange) || undefined}
                  />
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </DialContainer>
      </Inner>
    </Container>
  )
}
