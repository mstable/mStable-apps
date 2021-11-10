import React, { FC } from 'react'
import styled from 'styled-components'

import { useTransactionsState } from '@apps/base/context/transactions'
import { TransactionStatus } from '@apps/transaction-manifest'
import { ViewportWidth, gradientShift } from '@apps/theme'
import { Steps } from '@apps/dumb-components'
import { useSelectedMassetState } from '@apps/masset-hooks'

import { SaveMigrationProvider, useMigrationSteps } from './SaveMigrationProvider'

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`

const ExchangeRate = styled.div`
  margin: 2rem 0 0;
  text-align: center;
  display: flex;
  font-size: 1rem;
  flex: 1;
  justify-content: center;
  border: 1px dashed ${({ theme }) => theme.color.defaultBorder};
  justify-self: center;
  padding: 1rem;
  border-radius: 1rem;

  span {
    ${({ theme }) => theme.mixins.numeric};
  }
`

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  height: 100%;
  text-align: center;
`

const Card = styled.div`
  padding: 1.5rem;
  border-radius: 1.5rem;
  display: flex;
  align-items: center;
  flex-direction: column;

  @media (min-width: ${ViewportWidth.m}) {
    padding: 1.5rem 3.5rem;
  }

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 2rem;
  }

  p {
    font-size: 1rem;
    margin-bottom: 1rem;
    line-height: 1.5rem;

    span {
      ${({ theme }) => theme.mixins.numeric};
    }
  }

  ${gradientShift}

  &:before {
    border-radius: 1.5rem;
  }
`

const SaveMigrationContent: FC = () => {
  const steps = useMigrationSteps()
  const transactions = useTransactionsState()
  const massetState = useSelectedMassetState()
  const savingsContract = massetState?.savingsContracts.v2
  const submitting = Object.values(transactions)
    .filter(tx => tx.manifest?.formId === 'saveMigration')
    .some(tx => tx.status === TransactionStatus.Pending || tx.status === TransactionStatus.Response || tx.status === TransactionStatus.Sent)

  const stepsComplete = steps.length && steps.every(step => step.complete)

  return (
    <Card>
      <Inner>
        <h2>{!stepsComplete ? `Migration Assistant` : `Migration Complete! 🎉`}</h2>
        {!stepsComplete && (
          <>
            <div>
              <p>
                To continue earning interest on your <b>Save V1</b> balance, please migrate your balance by following the steps below:
              </p>
              <ExchangeRate>
                <div>
                  <span>1</span>&nbsp; mUSD = &nbsp;
                  <span>
                    {savingsContract?.latestExchangeRate?.rate && (1 / savingsContract.latestExchangeRate?.rate.simple).toFixed(2)}
                  </span>
                  &nbsp; imUSD
                </div>
              </ExchangeRate>
            </div>
          </>
        )}
        <StepsContainer>{steps.length && <Steps steps={steps} pending={submitting} />}</StepsContainer>
      </Inner>
    </Card>
  )
}

export const SaveMigration: FC = () => (
  <SaveMigrationProvider>
    <SaveMigrationContent />
  </SaveMigrationProvider>
)
