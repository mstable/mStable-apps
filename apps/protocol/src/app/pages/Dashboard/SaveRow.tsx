import React, { FC, useEffect, useMemo } from 'react'
import { TokenIcon } from '@apps/base/components/core'
import { useFetchPriceCtx } from '@apps/base/context/prices'
import { useCalculateUserBoost } from '@apps/boost'
import { MassetState } from '@apps/data-provider'
import { CountUp, CountUpUSD, Tooltip } from '@apps/dumb-components'
import { toK } from '@apps/formatters'
import { useSelectedMassetState } from '@apps/masset-hooks'
import { calculateApy } from '@apps/quick-maths'
import { MassetName } from '@apps/types'
import { useHistory } from 'react-router-dom'
import { useAvailableSaveApy } from '../../hooks/useAvailableSaveApy'
import { useSelectedMassetPrice } from '../../hooks/useSelectedMassetPrice'
import { useUpsertStream } from './RewardsContext'
import { DashNameTableCell, DashTableCell, DashTableRow, RewardsApy } from './Styled'
import { useRewardStreams } from '../../context/RewardStreamsProvider'
import { useTokenSubscription } from '@apps/base/context/tokens'
import { getSaveDeposited } from './utils'
import { useStakingRewards } from '../Save/hooks'

const useSaveVaultAPY = (mAssetName: MassetName, massetPrice?: number, userBoost?: number) => {
  const {
    savingsContracts: {
      v2: { boostedSavingsVault, latestExchangeRate },
    },
  } = useSelectedMassetState(mAssetName) as MassetState

  const { fetchPrice } = useFetchPriceCtx()
  const rewardsTokenPrice = fetchPrice(boostedSavingsVault?.rewardsToken.address)

  return useMemo(() => {
    if (!boostedSavingsVault || !massetPrice || !rewardsTokenPrice.value)
      return {
        base: 0,
        maxBoost: 0,
        userBoost: 0,
      }

    const { totalSupply, rewardRate } = boostedSavingsVault

    const stakingTokenPrice = latestExchangeRate.rate.simple * massetPrice

    const rewardRateSimple = parseInt(rewardRate.toString()) / 1e18
    const base = calculateApy(stakingTokenPrice, rewardsTokenPrice.value, rewardRateSimple, totalSupply)
    const maxBoost = calculateApy(stakingTokenPrice, rewardsTokenPrice.value, rewardRateSimple * 3, totalSupply)

    return {
      base,
      maxBoost,
      userBoost: (userBoost ?? 1) * base,
    }
  }, [userBoost, rewardsTokenPrice, boostedSavingsVault, massetPrice, latestExchangeRate])
}

export const SaveRow: FC<{ massetState: MassetState; showBalance: boolean }> = ({ massetState, showBalance }) => {
  const history = useHistory()
  const mAssetName = massetState.token.symbol.toLowerCase() as MassetName
  const massetPrice = useSelectedMassetPrice(mAssetName)
  const rewards = useRewardStreams()
  const upsertStream = useUpsertStream()
  const polygonRewards = useStakingRewards()

  const {
    savingsContracts: { v2: { boostedSavingsVault, token: saveToken } = {} },
  } = massetState as MassetState

  useTokenSubscription(saveToken?.address)

  const isPolygon = !!Object.keys(polygonRewards).length
  const userBoost = useCalculateUserBoost(boostedSavingsVault)
  const vaultApy = useSaveVaultAPY(mAssetName, massetPrice?.value, userBoost)
  const deposits = getSaveDeposited(massetState, massetPrice?.value, polygonRewards)

  const ethSaveApy = useAvailableSaveApy(mAssetName)?.value
  const polygonSaveApy = polygonRewards?.rewards?.find(v => v.id === 'yieldRewards')?.apy || 0
  const saveApy = isPolygon ? polygonSaveApy : ethSaveApy

  const polygonRewardsApy = polygonRewards?.rewards?.find(v => v.id === 'rewards')?.apy || 0
  const ethRewardsApy = vaultApy?.userBoost || 0
  const userBoostAPY = isPolygon ? polygonRewardsApy : ethRewardsApy

  const baseAPY = vaultApy?.base || 0
  const maxAPY = vaultApy?.maxBoost || 0

  const balanceToolTip = `
    Save: $${(deposits.save.simple || 0).toFixed(2)}<br />
    Vault: $${(deposits.vault.simple || 0).toFixed(2)}
  `
  const userBoostTip = `
    Save: ${saveApy?.toFixed(2) || 0}%<br />
    Vault Rewards: ${(userBoostAPY || 0).toFixed(2)}%
  `
  const apyTip = `
    Save: ${saveApy?.toFixed(2) || 0}%<br />
    Vault Rewards:<br />
    ${baseAPY?.toFixed(2)}-${maxAPY?.toFixed(2)}%
  `

  useEffect(() => {
    upsertStream(`reward-${mAssetName}`, rewards)
  }, [mAssetName, rewards, rewards?.amounts?.earned?.unlocked, upsertStream])

  const hasRewards = ((rewards?.amounts?.earned?.unlocked ?? 0) + rewards?.amounts?.unlocked ?? 0) > 0

  return (
    <DashTableRow onClick={() => history.push(`/${mAssetName}/save`)} buttonTitle="Explore">
      <DashNameTableCell>
        <TokenIcon symbol={`i${massetState.token.symbol}`} />
        {`i${massetState.token.symbol}`}
      </DashNameTableCell>
      <DashTableCell hasRewards={hasRewards}>
        {deposits.total.simple > 0 ? (
          <Tooltip hideIcon tip={userBoostTip}>
            <CountUp end={saveApy} suffix="%" />
            <RewardsApy active>
              <CountUp end={userBoostAPY} suffix="%" prefix="+" />
              <TokenIcon symbol="MTA" />
            </RewardsApy>
          </Tooltip>
        ) : (
          <Tooltip hideIcon tip={apyTip}>
            <CountUp end={saveApy} suffix="%" />
            <RewardsApy>
              {isPolygon ? (
                <CountUp end={polygonRewardsApy} prefix="+" suffix="%" />
              ) : (
                <>
                  <CountUp end={baseAPY} prefix="+" suffix="%" />
                  &nbsp;→&nbsp;
                  <CountUp end={maxAPY} suffix="%" />
                </>
              )}
              <TokenIcon symbol="MTA" />
            </RewardsApy>
          </Tooltip>
        )}
      </DashTableCell>
      {showBalance && (
        <DashTableCell>
          <Tooltip tip={balanceToolTip} hideIcon>
            <CountUp end={deposits.total.simple} prefix="$" />
          </Tooltip>
        </DashTableCell>
      )}
      <DashTableCell>
        <CountUpUSD end={massetState.token.totalSupply.simple} price={massetPrice.value} formattingFn={toK} />
      </DashTableCell>
    </DashTableRow>
  )
}
