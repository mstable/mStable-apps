import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Signer } from 'ethers'

import { TransactionStatus } from '@apps/transaction-manifest'
import { BigDecimal } from '@apps/bigdecimal'
import { Button } from '@apps/dumb-components'
import { APP_NAME } from '@apps/types'

import { useTransactionsDispatch, useTransactionsState } from '../../context/TransactionsProvider'
import { useNetworkPrices } from '../../context/NetworkProvider'
import { useNativeToken } from '../../context/TokensProvider'
import { Amount, TokenIcon } from '../core'
import { GasStation } from './GasStation'
import { useGas } from './TransactionGasProvider'
import { StakeValidation } from './StakeValidation'
import { useSigner, useWallet } from '../../context/AccountProvider'
import { StakeSignatures, useStakeSignatures } from '../../hooks/useStakeSignatures'
import { API_ENDPOINT } from '../../utils/constants'
import { useBaseCtx } from '../../BaseProviders'

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
  signer: Signer,
  stakeMessage: string,
  setStakeSignatures: React.Dispatch<React.SetStateAction<StakeSignatures>>,
) => {
  const walletAddress = (await signer.getAddress())?.toLowerCase()
  if (!walletAddress) {
    console.error('Missing wallet address', walletAddress)
    return false
  }

  let resp: Response
  let signature: string | undefined

  try {
    signature = await signer.signMessage(stakeMessage)
  } catch (error) {
    console.error('Error signing message', error)
  }

  if (!signature) {
    console.error('Missing signature', walletAddress, signature)
    return false
  }

  try {
    resp = await fetch(`${API_ENDPOINT}/signature/${walletAddress}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ signature }),
    })

    if (resp.status !== 201) {
      console.error(await resp.text())
      return false
    }

    setStakeSignatures(prevSignatures => ({
      ...prevSignatures,
      [walletAddress]: signature as string,
    }))
  } catch (e) {
    console.error('failed to sign transaction', e)
    return false
  }
  return true
}

const stakeSignedFunctions = new Set(['compoundRewards', 'stake(uint256)'])

export const PendingTransaction: FC<{
  id: string
}> = ({ id }) => {
  const { [id]: transaction } = useTransactionsState()
  const signer = useSigner()
  const wallet = useWallet()
  const { cancel, send } = useTransactionsDispatch()
  const { estimationError, gasLimit, gasPrice, insufficientBalance } = useGas()
  const [{ appName }] = useBaseCtx()

  const [stakeSignatures, setStakeSignatures] = useStakeSignatures()
  const [isStakeSigned, setIsStakeSigned] = useState<boolean>(false)
  const [isStakeSignedForm, setIsStakeSignedForm] = useState<boolean>(false)

  const isGovernance = appName === APP_NAME.GOVERNANCE

  useEffect(() => {
    if (!isGovernance) return

    // TODO use context/updater pattern. This fetches for every pending tx (ie when this component is mounted)
    const fetchSignature = async () => {
      const walletAddress = (await signer?.getAddress())?.toLowerCase()
      if (!walletAddress) return
      setIsStakeSigned(!!stakeSignatures[walletAddress])
    }
    fetchSignature().catch(console.error)
  }, [signer, stakeSignatures, isGovernance])

  if (!transaction) {
    return null
  }

  const isGnosisSafe = wallet?.provider?.walletMeta?.name === 'Gnosis Safe Multisig'
  const checkTransactionSignature =
    isGovernance && !isGnosisSafe && transaction.manifest.fn && stakeSignedFunctions.has(transaction.manifest.fn) && stakeSignatures.message

  const disabled = !!(
    estimationError ||
    !gasLimit ||
    !gasPrice ||
    insufficientBalance ||
    transaction.status !== TransactionStatus.Pending ||
    (checkTransactionSignature && !isStakeSigned && !isStakeSignedForm)
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
            if (signer && gasPrice && gasLimit) {
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
