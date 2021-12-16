import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { Button, Tooltip } from '@apps/dumb-components'
import { ViewportWidth } from '@apps/theme'
import { ReactComponent as MTAIcon } from '@apps/icons/tokens/MTA.svg'
import { ReactComponent as BPTIcon } from '@apps/icons/tokens/BPT-MTA-ETH.svg'
import { ReactComponent as CheckmarkIcon } from '@apps/icons/checkmark.svg'
import { useNetworkAddresses } from '@apps/base/context/network'

import { useSetStakedToken, useStakedToken } from '../../context/StakedToken'
import { useStakingStatusDispatch } from '../../context/StakingStatus'

enum Selection {
  MTA,
  BPT,
}

const IconContainer = css`
  display: flex;
  justify-content: flex-end;
`

const MTAContainer = styled.div`
  ${IconContainer};
  width: 12rem;

  svg {
    width: 4rem;
    height: 100%;
  }
`

const BPTContainer = styled.div`
  ${IconContainer};
  width: 14rem;

  svg {
    width: 4.25rem;
    height: 100%;
  }
`

const Checklist = styled.div`
  display: flex;
  justify-content: flex-start;
  color: ${({ theme }) => theme.color.bodyAccent};
  font-size: 0.75rem;

  > div {
    display: flex;
    background: linear-gradient(124.57deg, #2c6fd7 29.6%, #1a57b5 100%);
    padding: 0.25rem 0.5rem;
    border-radius: 0.625rem;
    align-items: center;
    margin-right: 0.75rem;

    svg {
      width: 0.75rem;
      height: 0.75rem;

      path {
        fill: white;
      }
    }
  }
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  height: 100%;

  > div:first-child {
    display: flex;
    flex-direction: column;

    h2 {
      font-size: 1.25rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    h4 {
      color: ${({ theme }) => theme.color.bodyAccent};
      font-size: 0.875rem;
    }
  }

  @media (min-width: ${ViewportWidth.m}) {
    max-height: 6rem;
  }
`

const SelectionBox = styled.div`
  display: flex;
  position: relative;
  flex: 1;
  flex-direction: column;
  background: ${({ theme }) => theme.color.background[0]};
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  border-radius: 1rem;
  padding: 2.25rem 1rem 1rem 1rem;
  justify-content: space-between;
  gap: 2rem;
`

const MTASelectionBox = styled(SelectionBox)`
  border: 1px solid ${({ theme }) => theme.color.primaryTransparent};
`

const RecommendedBox = styled.div`
  --height: 1.25rem;

  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  top: calc(var(--height) / -2);
  right: 0;
  height: var(--height);

  > div {
    display: flex;
    align-items: center;
    height: 100%;
    border-radius: 2rem;
    background: ${({ theme }) => theme.color.primary};
    color: ${({ theme }) => theme.color.white};
    padding: 0 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 1.125rem;
  background: ${({ theme }) => theme.color.background[1]};
  gap: 1rem;
  margin-top: 1rem;

  @media (min-width: ${ViewportWidth.m}) {
    margin-top: 0;
    padding: 1rem;
    border: 1px solid ${({ theme }) => theme.color.defaultBorder};
    align-items: center;

    > div {
      max-width: 40rem;
    }
  }

  @media (min-width: ${ViewportWidth.l}) {
    flex-direction: row;
    align-items: unset;

    > div {
      max-width: 100%;
      flex: 1;
    }
  }
`

export const StakeSelection: FC = () => {
  const { options } = useStakedToken()
  const setStakedToken = useSetStakedToken()
  const { setSelectedOption } = useStakingStatusDispatch()
  const stkMtaAddress = useNetworkAddresses()?.stkMTA

  const handleSelection = (selection: Selection) => {
    const tokens = Object.keys(options)
      .map(key => key)
      .sort(a => (a === stkMtaAddress ? -1 : 1))
    setStakedToken(tokens[selection === Selection.MTA ? 0 : 1])
    setSelectedOption()
  }

  return (
    <Container>
      <MTASelectionBox>
        <RecommendedBox>
          <div>
            <Tooltip tip="MTA is the preferred staking choice as the transaction cost is cheaper and less complex" hideIcon>
              Recommended
            </Tooltip>
          </div>
        </RecommendedBox>
        <Header>
          <div>
            <h2>Stake MTA</h2>
            <h4>
              In return for participating in governance, you will receive MTA rewards.{' '}
              <a href="https://docs.mstable.org/using-mstable/mta-staking/staking-v2" target="_blank" rel="noopener noreferrer">
                Learn about the risks
              </a>
            </h4>
          </div>
          <MTAContainer>
            <MTAIcon />
          </MTAContainer>
        </Header>
        <Checklist>
          <div>
            <CheckmarkIcon />
          </div>
          MTA Rewards
        </Checklist>
        <Button highlighted scale={1.125} onClick={() => handleSelection(Selection.MTA)}>
          Stake MTA
        </Button>
      </MTASelectionBox>
      <SelectionBox>
        <Header>
          <div>
            <h2>Stake MTA/ETH BPT</h2>
            <h4>
              In return for participating in governance, you will receive MTA, BAL rewards and trading fees.{' '}
              <a href="https://docs.mstable.org/using-mstable/mta-staking/staking-v2" target="_blank" rel="noopener noreferrer">
                Learn about the risks
              </a>
            </h4>
          </div>
          <BPTContainer>
            <BPTIcon />
          </BPTContainer>
        </Header>
        <Checklist>
          <div>
            <CheckmarkIcon />
          </div>
          MTA Rewards, BAL Rewards, Trading Fees
        </Checklist>
        <Button highlighted scale={1.125} onClick={() => handleSelection(Selection.BPT)}>
          Stake BPT
        </Button>
      </SelectionBox>
    </Container>
  )
}
