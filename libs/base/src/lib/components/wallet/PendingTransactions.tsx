import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'

import { TransactionStatus } from '@apps/transaction-manifest'
import { BigDecimal } from '@apps/bigdecimal'
import { Button } from '@apps/dumb-components'

import { useTransactionsDispatch, useTransactionsState } from '../../context/TransactionsProvider'
import { useNetworkPrices } from '../../context/NetworkProvider'
import { useNativeToken } from '../../context/TokensProvider'
import { Amount, TokenIcon } from '../core'
import { GasStation } from './GasStation'
import { useGas } from './TransactionGasProvider'
import { StakeValidation } from './StakeValidation'
import { useSigner } from '../../context/AccountProvider'
import { Signer } from 'ethers'
import { StakeSignatures, useStakeSignatures } from '../../hooks/useStakeSignatures'
import { API_ENDPOINT } from '../../utils/constants'

const Buttons = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
`

const Purpose = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  > :first-child {
    font-size: 1.3rem;
    line-height: 1.7rem;
  }
`

const TxError = styled.div`
  font-size: 1rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.color.redTransparent};
  > div {
    font-size: 0.8rem;
    font-weight: 600;
  }
`

const Container = styled.div<{ status: TransactionStatus }>`
  width: 24rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 1.25rem;
  border: 1px
    ${({ status, theme }) =>
      status === TransactionStatus.Confirmed
        ? theme.color.green
        : status === TransactionStatus.Error
        ? theme.color.red
        : theme.color.background[3]}
    solid;
  border-radius: 1rem;
  color: ${({ theme }) => theme.color.body};
  background: ${({ theme }) => theme.color.background[0]};
`

const NativeTokenBalanceContainer = styled.div<{ insufficientBalance: boolean }>`
  > div:first-child {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    img {
      width: 1.5rem;
    }
    color: ${({ insufficientBalance, theme }) => (insufficientBalance ? theme.color.red : 'inherit')};
  }
`

const NativeTokenBalance: FC = () => {
  const { insufficientBalance } = useGas()
  const nativeToken = useNativeToken()
  const networkPrices = useNetworkPrices()

  return (
    <NativeTokenBalanceContainer insufficientBalance={insufficientBalance}>
      <div>
        <TokenIcon symbol={nativeToken.symbol} />
        <Amount amount={nativeToken.balance} price={BigDecimal.maybeParse(networkPrices.value?.nativeToken?.toFixed(4))} />
      </div>
    </NativeTokenBalanceContainer>
  )
}

const signStake = async (
  signer: Signer | undefined,
  stakeMessage: string,
  setStakeSignatures: React.Dispatch<React.SetStateAction<StakeSignatures>>,
) => {
  try {
    const signature = await signer?.signMessage(stakeMessage)
    const walletAddress = (await signer?.getAddress())?.toLowerCase()

    if (!walletAddress || !signature) {
      console.error('Missing wallet or signature', walletAddress, signature)
      return false
    }

    const res = await fetch(`${API_ENDPOINT}/signature/${walletAddress}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ signature }),
    })
    if (res.status !== 201) {
      console.error(await res.text())
      return false
    }
    setStakeSignatures(prevSignatures => ({
      ...prevSignatures,
      [walletAddress]: signature,
    }))
  } catch (e) {
    console.error('failed to sign transaction', e)
    return false
  }
  return true
}

export const PendingTransaction: FC<{
  id: string
}> = ({ id }) => {
  const { [id]: transaction } = useTransactionsState()
  const signer = useSigner()
  const { cancel, send } = useTransactionsDispatch()
  const { estimationError, gasLimit, gasPrice, insufficientBalance } = useGas()

  const [stakeSignatures, setStakeSignatures] = useStakeSignatures()
  const [isStakeSigned, setIsStakeSigned] = useState<boolean>(false)
  const [isStakeSignedForm, setIsStakeSignedForm] = useState<boolean>(false)
  const stakeSignedFunctions = ['compoundRewards', 'stake(uint256)']

  useEffect(() => {
    const fetchSignature = async () => {
      const walletAddress = (await signer?.getAddress())?.toLowerCase()
      if (!walletAddress) return
      setIsStakeSigned(!!stakeSignatures[walletAddress])
    }
    fetchSignature()
  }, [signer, stakeSignatures])

  if (!transaction) {
    return null
  }

  const checkTransactionSignature = transaction.manifest.fn && stakeSignedFunctions.includes(transaction.manifest.fn) && stakeSignatures.message

  const disabled = !!(
    estimationError ||
    !gasLimit ||
    !gasPrice ||
    insufficientBalance ||
    transaction.status !== TransactionStatus.Pending ||
    (checkTransactionSignature && !isStakeSigned && !isStakeSigned && !isStakeSignedForm)
  )

  return (
    <Container status={transaction.status}>
      <Purpose>
        <div>{transaction.manifest.purpose.present}</div>
        <NativeTokenBalance />
      </Purpose>
      {transaction.status === TransactionStatus.Pending && <GasStation />}
      {!isStakeSigned && checkTransactionSignature && (
        <StakeValidation signMsg={stakeSignatures.message} isStakeSigned={isStakeSignedForm} setIsStakeSigned={setIsStakeSignedForm} />
      )}
      {estimationError && (
        <TxError>
          <div>Error during estimation</div>
          {estimationError}
        </TxError>
      )}
      <Buttons>
        <Button
          scale={0.7}
          onClick={() => {
            cancel(transaction.manifest.id)
          }}
        >
          Cancel
        </Button>
        <Button
          scale={0.7}
          highlighted={!disabled}
          disabled={disabled}
          onClick={async () => {
            if (gasPrice && gasLimit) {
              const cont =
                !isStakeSigned && checkTransactionSignature ? await signStake(signer, stakeSignatures.message, setStakeSignatures) : true
              if (!cont) {
                console.error('Message not signed')
                return
              }
              send(transaction.manifest, gasLimit, gasPrice)
            }
          }}
        >
          {!isStakeSigned && checkTransactionSignature ? 'Sign and Send transaction' : 'Send transaction'}
        </Button>
      </Buttons>
    </Container>
  )
}
