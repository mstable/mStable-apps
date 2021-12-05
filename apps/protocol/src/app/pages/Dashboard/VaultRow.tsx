import { TokenIcon } from '@apps/base/components/core'
import { useFetchPriceCtx } from '@apps/base/context/prices'
import { BigDecimal } from '@apps/bigdecimal'
import { useCalculateUserBoost } from '@apps/boost'
import { MassetState } from '@apps/data-provider'
import { CountUp, CountUpUSD, DifferentialCountup } from '@apps/dumb-components'
import { toK } from '@apps/formatters'
import { useSelectedMassetState } from '@apps/masset-hooks'
import { calculateApy } from '@apps/quick-maths'
import { BoostedCombinedAPY, FetchState, MassetName } from '@apps/types'
import React, { FC, useMemo } from 'react'
import { useSelectedSaveVersion } from '../../context/SelectedSaveVersionProvider'
import { useSelectedMassetPrice } from '../../hooks/useSelectedMassetPrice'
import { DashNameTableCell, DashTableCell, DashTableRow } from './Styled'

const useSaveVaultAPY = (mAssetName: MassetName, userBoost?: number): FetchState<BoostedCombinedAPY> => {
  const {
    savingsContracts: {
      v2: { boostedSavingsVault, latestExchangeRate },
    },
  } = useSelectedMassetState(mAssetName) as MassetState

  const { fetchPrice } = useFetchPriceCtx()
  const massetPrice = useSelectedMassetPrice(mAssetName)
  const rewardsTokenPrice = fetchPrice(boostedSavingsVault?.rewardsToken.address)

  return useMemo(() => {
    if (!boostedSavingsVault || !massetPrice.value || !rewardsTokenPrice.value) return { fetching: true }

    const { totalSupply, rewardRate } = boostedSavingsVault

    const stakingTokenPrice = latestExchangeRate.rate.simple * massetPrice.value

    const rewardRateSimple = parseInt(rewardRate.toString()) / 1e18
    const base = calculateApy(stakingTokenPrice, rewardsTokenPrice.value, rewardRateSimple, totalSupply)
    const maxBoost = calculateApy(stakingTokenPrice, rewardsTokenPrice.value, rewardRateSimple * 3, totalSupply)

    const rewards = {
      base,
      maxBoost,
      userBoost: (userBoost ?? 1) * base,
    }

    return {
      value: {
        rewards,
        combined: rewards,
      },
    }
  }, [userBoost, rewardsTokenPrice, boostedSavingsVault, massetPrice, latestExchangeRate])
}

export const VaultRow: FC<{ mAssetName: MassetName }> = ({ mAssetName }) => {
  const massetState = useSelectedMassetState(mAssetName)
  const massetPrice = useSelectedMassetPrice(mAssetName)
  const [selectedSaveVersion] = useSelectedSaveVersion()

  const {
    savingsContracts: {
      v1: { savingsBalance: saveV1Balance } = {},
      v2: { boostedSavingsVault, token: saveToken, latestExchangeRate: { rate: saveExchangeRate } = {} },
    },
  } = massetState as MassetState

  const balance = useMemo(() => {
    if (selectedSaveVersion === 1) return saveV1Balance?.balance

    return (
      (boostedSavingsVault?.account?.rawBalance ?? BigDecimal.ZERO)
        .add(saveToken?.balance ?? BigDecimal.ZERO)
        .mulTruncate(saveExchangeRate?.exact ?? BigDecimal.ONE.exact) ?? BigDecimal.ZERO
    )
  }, [boostedSavingsVault, saveToken, saveExchangeRate, selectedSaveVersion, saveV1Balance])

  const userBoost = useCalculateUserBoost(boostedSavingsVault)
  const apy = useSaveVaultAPY(mAssetName, userBoost)

  return (
    <DashTableRow>
      <DashNameTableCell>
        <TokenIcon symbol={massetState.token.symbol} />
        {massetState.token.symbol}
      </DashNameTableCell>
      <DashTableCell>
        {userBoost > 1 && apy.value?.rewards.userBoost ? (
          <DifferentialCountup prev={apy.value?.rewards.base} end={apy.value.rewards.userBoost} suffix="%" />
        ) : (
          <>
            <CountUp end={apy.value?.rewards.base ?? 0} />
            &nbsp;-&nbsp;
            <CountUp end={apy.value?.rewards.maxBoost ?? 0} suffix="%" />
          </>
        )}
      </DashTableCell>
      <DashTableCell>
        <CountUp end={(balance?.simple ?? 0) * (massetPrice.value ?? 0)} prefix="$" />
      </DashTableCell>
      <DashTableCell>
        <CountUpUSD end={massetState.token.totalSupply.simple} price={massetPrice.value} formattingFn={toK} />
      </DashTableCell>
    </DashTableRow>
  )
}
