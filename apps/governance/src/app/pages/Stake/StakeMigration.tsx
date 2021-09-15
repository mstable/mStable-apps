import React, { FC } from 'react'
import styled from 'styled-components'

import { StakeForm } from './StakeForm'
import { ReactComponent as MigrationArrow } from '../../../assets/migration-arrow.svg'
import { ViewportWidth } from '@apps/base/theme'
import { UnstyledButton } from '@apps/components/core'

const CloseButton = styled(UnstyledButton)`
  color: ${({ theme }) => theme.color.whiteTransparent};
  border-radius: 1rem;
  align-self: flex-end;

  &:hover {
    text-decoration: underline;
  }
`

const StyledStakeForm = styled(StakeForm)`
  background: ${({ theme }) => theme.color.background[0]};
  padding: 1rem 0.75rem;
  border-radius: 1rem;
  max-width: 32rem;
`

const StakeFormContainer = styled.div`
  background: #3f51f0;
  display: flex;
  padding: 0.5rem;
  justify-content: center;
  width: 100%;
  border-radius: 1rem;

  @media (min-width: ${ViewportWidth.m}) {
    padding: 1rem;
  }

  @media (min-width: ${ViewportWidth.l}) {
    padding: 0.5rem;
    max-width: 26rem;
  }
`

const MigrationPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.5rem 1.25rem;

  > div:first-child {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h1 {
    font-size: 2.125rem;
    font-weight: 600;
    max-width: 12ch;
    line-height: 2.75rem;
    color: ${({ theme }) => theme.color.white};
  }

  p {
    font-size: 1rem;
    color: ${({ theme }) => theme.color.white};
    line-height: 1.5rem;
  }

  a {
    color: ${({ theme }) => theme.color.white};
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (min-width: ${ViewportWidth.l}) {
    padding: 2.125rem;
  }
`

const Achievement = styled.div`
  ${({ theme }) => theme.mixins.pixel};

  display: flex;
  text-transform: uppercase;
  letter-spacing: 0.2ch;
  justify-content: space-between;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.color.white};
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.color.whiteTransparenter};
  padding-top: 1.5rem;

  span {
    background: linear-gradient(180deg, #4859f0 0%, #1929c0 100%);
    box-shadow: 0px 4px 10px 0px #1e2db9;
    border-radius: 1rem;
    padding: 1rem;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(333.23deg, #2c3dd7 30.23%, #144561 135.17%);
  border-radius: 1.125rem;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  align-items: center;

  @media (min-width: ${ViewportWidth.m}) {
    padding: 2rem;
  }

  @media (min-width: ${ViewportWidth.l}) {
    padding: 0;
    flex-direction: row;
  }
`

export const StakeMigration: FC<{ onSkip?: () => void }> = ({ onSkip }) => (
  <Container>
    <MigrationPanel>
      <div>
        <h1>
          Migrate
          <br /> to Staking V2
        </h1>
        <MigrationArrow />
      </div>
      <p>
        Migrating your MTA will reward you with a permanent quest multiplier.{' '}
        <b>Completing quests will increase your Voting Power & Savings boost within the mStable ecosystem.</b>
      </p>
      <Achievement>
        <div>Quest Multiplier</div>
        <span>1.2x</span>
      </Achievement>
      <CloseButton onClick={onSkip}>Skip</CloseButton>
    </MigrationPanel>
    <StakeFormContainer>
      <StyledStakeForm isMigrating={true} />
    </StakeFormContainer>
  </Container>
)
