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

  const {
    savingsContracts: { v2: { boostedSavingsVault, token: saveToken } = {} },
  } = massetState as MassetState

  useTokenSubscription(saveToken?.address)

  const userBoost = useCalculateUserBoost(boostedSavingsVault)
  const vaultApy = useSaveVaultAPY(mAssetName, massetPrice?.value, userBoost)
  const deposits = getSaveDeposited(massetState, massetPrice?.value)
  const saveApy = useAvailableSaveApy(mAssetName)

  const userBoostAPY = saveApy?.value + vaultApy?.userBoost || 0
  const baseAPY = saveApy?.value + vaultApy?.base || 0
  const maxAPY = saveApy?.value + vaultApy?.maxBoost || 0

  const balanceToolTip = `
    Save: $${(deposits.save.simple || 0).toFixed(2)}<br />
    Vault: $${(deposits.vault.simple || 0).toFixed(2)}
  `
  const userBoostTip = `
    Save: ${saveApy?.value?.toFixed(2) || 0}%<br />
    Vault Rewards: ${(userBoostAPY || 0).toFixed(2)}%
  `
  const apyTip = `
    Save: ${saveApy?.value?.toFixed(2) || 0}%<br />
    Vault Rewards:<br />
    ${baseAPY?.toFixed(2)}-${maxAPY?.toFixed(2)}%
  `

  useEffect(() => {
    if (!rewards?.amounts?.earned?.unlocked) return
    upsertStream(`reward-${mAssetName}`, rewards)
  }, [mAssetName, rewards, rewards?.amounts?.earned?.unlocked, upsertStream])

  return (
    <DashTableRow onClick={() => history.push(`/${mAssetName}/save`)} buttonTitle="Explore">
      <DashNameTableCell>
        <TokenIcon symbol={`i${massetState.token.symbol}`} />
        {`i${massetState.token.symbol}`}
      </DashNameTableCell>
      <DashTableCell>
        {deposits.total.simple > 0 ? (
          <Tooltip hideIcon tip={userBoostTip}>
            <CountUp end={saveApy?.value} suffix="%" />
            <RewardsApy active>
              <CountUp end={userBoostAPY} suffix="%" />
              <TokenIcon symbol="MTA" />
            </RewardsApy>
          </Tooltip>
        ) : (
          <Tooltip hideIcon tip={apyTip}>
            <CountUp end={saveApy?.value} suffix="%" />
            <RewardsApy>
              <CountUp end={baseAPY} />
              &nbsp;-&nbsp;
              <CountUp end={maxAPY} suffix="%" />
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
