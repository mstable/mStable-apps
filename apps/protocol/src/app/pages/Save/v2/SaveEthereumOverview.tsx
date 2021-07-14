import React, { FC, ReactElement, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { useEffectOnce } from 'react-use'
import { useSelectedSaveVersion } from '../../../context/SelectedSaveVersionProvider'
import { useSelectedMassetState, MassetState } from '@apps/base/context/data'
import { useRewardStreams } from '../../../context/RewardStreamsProvider'
import { useSelectedMassetPrice, FetchState, useCalculateUserBoost, useAvailableSaveApy } from '@apps/hooks'
import { BigDecimal } from '@apps/bigdecimal'
import {
  TransitionCard,
  CardContainer as TransitionContainer,
  CardButton as Button,
  CountUp,
  DifferentialCountup,
  ThemedSkeleton,
  Tooltip,
} from '@apps/components/core'

import { UserBoost } from '../../../components/rewards/UserBoost'
import { PokeBoost } from '../../../components/PokeBoost'
import { UserRewards } from '../../Pools/Detail/UserRewards'

import { SavePosition } from './SavePosition'
import { OnboardingBanner } from './OnboardingBanner'

enum Selection {
  Balance = 'Balance',
  SaveAPY = 'SaveApy',
  VaultAPY = 'VaultApy',
  Rewards = 'Rewards',
}

const { Balance, Rewards, VaultAPY } = Selection

const WarningBadge = (): JSX.Element => (
  <svg width="32" height="36" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="18" r="16" fill="#DE1717" />
    <path
      d="M18.1888 8.552L17.7088 20.048H14.2288L13.7488 8.552H18.1888ZM16.0288 26.192C15.3088 26.192 14.7168 25.984 14.2528 25.568C13.8048 25.136 13.5808 24.608 13.5808 23.984C13.5808 23.344 13.8048 22.808 14.2528 22.376C14.7168 21.944 15.3088 21.728 16.0288 21.728C16.7328 21.728 17.3088 21.944 17.7568 22.376C18.2208 22.808 18.4528 23.344 18.4528 23.984C18.4528 24.608 18.2208 25.136 17.7568 25.568C17.3088 25.984 16.7328 26.192 16.0288 26.192Z"
      fill="white"
    />
  </svg>
)

const StyledWarningBadge = styled(WarningBadge)`
  position: absolute;
  top: 0;
  width: 1.25rem;
  height: 1.25rem;
  right: -1.5rem;
`

const BalanceHeading = styled.div`
  display: flex;
  justify-content: center;

  > div:first-child {
    display: flex;
    justify-content: center;
    position: relative;
  }
`

const Container = styled.div`
  > div {
    margin-bottom: 1.25rem;
  }
`

interface BoostedApy {
  base: number
  userBoost?: number
  maxBoost: number
}

interface PoolsAPIResponse {
  pools: {
    name: string
    apy: string
    apyDetails:
      | {
          rewardsOnlyBase: string
          rewardsOnlyMax: string
          combinedBase: string
          combinedMax: string
          yieldOnly: string
        }
      | {
          rewardsOnlyBase: string
          rewardsOnlyMax: string
        }
    pair: string[]
    pairLink: string
    poolRewards: string[]
    totalStakedUSD: string
    logo: string
  }[]
}

// FIXME sir - change pattern
let cachedAPY: FetchState<BoostedApy> = { fetching: true }

// TODO this can be done without API
const useSaveVaultAPY = (symbol?: string, userBoost?: number): FetchState<BoostedApy> => {
  useEffectOnce(() => {
    if (!symbol) return

    fetch('https://api.mstable.org/pools')
      .then(res =>
        res.json().then(({ pools }: PoolsAPIResponse) => {
          const pool = pools.find(p => p.pair[0] === symbol)
          if (!pool) return
          const base = parseFloat(pool?.apyDetails.rewardsOnlyBase)
          const maxBoost = parseFloat(pool?.apyDetails.rewardsOnlyMax)
          cachedAPY = {
            value: {
              base,
              maxBoost,
            },
          }
        }),
      )
      .catch(error => {
        cachedAPY = { error: error.message }
      })
  })

  const apy = useMemo(() => {
    if (!cachedAPY?.value) return cachedAPY
    return {
      value: {
        base: cachedAPY.value.base,
        maxBoost: cachedAPY.value.maxBoost,
        userBoost: (userBoost ?? 1) * cachedAPY.value.base,
      },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userBoost, symbol, cachedAPY])

  return apy
}

const UserSaveBoost: FC = () => {
  const {
    savingsContracts: {
      v2: { token, boostedSavingsVault },
    },
  } = useSelectedMassetState() as MassetState

  const userBoost = useCalculateUserBoost(boostedSavingsVault)
  const apy = useSaveVaultAPY(token?.symbol, userBoost)
  return boostedSavingsVault ? <UserBoost vault={boostedSavingsVault} apy={apy} /> : null
}

const components: Record<string, ReactElement> = {
  [Balance]: <SavePosition />,
  [VaultAPY]: <UserSaveBoost />,
  [Rewards]: <UserRewards />,
}

export const SaveEthereumOverview: FC = () => {
  const [selection, setSelection] = useState<Selection | undefined>()
  const massetState = useSelectedMassetState()
  const massetPrice = useSelectedMassetPrice()
  const rewardStreams = useRewardStreams()
  const [selectedSaveVersion] = useSelectedSaveVersion()
  const saveApy = useAvailableSaveApy()

  const {
    savingsContracts: {
      v1: { savingsBalance: saveV1Balance } = {},
      v2: { boostedSavingsVault, token: saveToken, latestExchangeRate: { rate: saveExchangeRate } = {} },
    },
  } = massetState as MassetState

  const userBoost = useCalculateUserBoost(boostedSavingsVault)
  const apy = useSaveVaultAPY(saveToken?.symbol, userBoost)

  const totalEarned =
    (rewardStreams?.amounts.earned.unlocked ?? 0) + (rewardStreams?.amounts.previewLocked ?? 0) + (rewardStreams?.amounts.locked ?? 0)

  const userBalance = useMemo(() => {
    if (selectedSaveVersion === 1) return saveV1Balance?.balance

    return (
      (boostedSavingsVault?.account?.rawBalance ?? BigDecimal.ZERO)
        .add(saveToken?.balance ?? BigDecimal.ZERO)
        .mulTruncate(saveExchangeRate?.exact ?? BigDecimal.ONE.exact) ?? BigDecimal.ZERO
    )
  }, [boostedSavingsVault, saveToken, saveExchangeRate, selectedSaveVersion, saveV1Balance])

  const isSaveV1 = selectedSaveVersion === 1
  const combinedBaseApy = (apy?.value?.base ?? 0) + (saveApy?.value ?? 0)
  const combinedMaxApy = (apy?.value?.maxBoost ?? 0) + (saveApy?.value ?? 0)
  const combinedUserApy = (apy?.value?.userBoost ?? 0) + (saveApy?.value ?? 0)

  const handleSelection = useCallback((newValue: Selection) => setSelection(selection === newValue ? undefined : newValue), [selection])

  return (
    <Container>
      <OnboardingBanner />
      <TransitionCard components={components} selection={selection}>
        <TransitionContainer>
          <Button active={selection === Balance} onClick={() => handleSelection(Balance)} disabled={!boostedSavingsVault}>
            <BalanceHeading>
              <div>
                <h3>Balance</h3>
                {isSaveV1 && <StyledWarningBadge />}
              </div>
            </BalanceHeading>
            <CountUp end={(userBalance?.simple ?? 0) * (massetPrice ?? 0)} prefix="$" />
          </Button>
          {!isSaveV1 && !!boostedSavingsVault && (
            <Button active={selection === VaultAPY} onClick={() => handleSelection(VaultAPY)}>
              <h3>Rewards APY</h3>
              {apy?.fetching ? (
                <ThemedSkeleton height={20} width={64} />
              ) : (
                <div>
                  {userBoost > 1 && apy?.value?.userBoost ? (
                    <>
                      <Tooltip tip={`Combined APY: ${combinedUserApy.toFixed(2)}%`} hideIcon>
                        <DifferentialCountup prev={apy.value?.base} end={apy.value.userBoost} suffix="%" />
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      <CountUp end={apy?.value?.base ?? 0} />
                      &nbsp;-&nbsp;
                      <CountUp end={apy?.value?.maxBoost ?? 0} suffix="%" />
                      <Tooltip
                        tip={`Deposits to the Vault earn interest in addition to MTA rewards. Combined APY: ${combinedBaseApy.toFixed(
                          2,
                        )}-${combinedMaxApy.toFixed(2)}%`}
                      />
                    </>
                  )}
                </div>
              )}
            </Button>
          )}
          {!!boostedSavingsVault && (
            <Button active={selection === Rewards} onClick={() => handleSelection(Rewards)}>
              <h3>Rewards</h3>
              <div>
                <CountUp end={totalEarned} suffix=" MTA" />
                <Tooltip tip="MTA rewards unlock over time" />
              </div>
            </Button>
          )}
        </TransitionContainer>
      </TransitionCard>
      <PokeBoost apy={apy} vault={boostedSavingsVault} />
    </Container>
  )
}
