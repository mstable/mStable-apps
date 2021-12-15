import { TokenIcon } from '@apps/base/components/core'
import { useFetchPriceCtx } from '@apps/base/context/prices'
import { useCalculateUserBoost } from '@apps/boost'
import { MassetState } from '@apps/data-provider'
import { CountUp, CountUpUSD, Tooltip } from '@apps/dumb-components'
import { toK } from '@apps/formatters'
import { useSelectedMassetState } from '@apps/masset-hooks'
import { calculateApy } from '@apps/quick-maths'
import { MassetName } from '@apps/types'
import React, { FC, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSelectedSaveVersion } from '../../context/SelectedSaveVersionProvider'
import { useAvailableSaveApy } from '../../hooks/useAvailableSaveApy'
import { useSelectedMassetPrice } from '../../hooks/useSelectedMassetPrice'
import { useSubscribeRewardStream } from './RewardsContext'
import { DashNameTableCell, DashTableCell, DashTableRow } from './Styled'
import { getVaultDeposited } from './utils'

const useSaveVaultAPY = (mAssetName: MassetName, userBoost?: number) => {
  const {
    savingsContracts: {
      v2: { boostedSavingsVault, latestExchangeRate },
    },
  } = useSelectedMassetState(mAssetName) as MassetState

  const { fetchPrice } = useFetchPriceCtx()
  const massetPrice = useSelectedMassetPrice(mAssetName)
  const rewardsTokenPrice = fetchPrice(boostedSavingsVault?.rewardsToken.address)

  return useMemo(() => {
    if (!boostedSavingsVault || !massetPrice.value || !rewardsTokenPrice.value)
      return {
        base: 0,
        maxBoost: 0,
        userBoost: 0,
      }

    const { totalSupply, rewardRate } = boostedSavingsVault

    const stakingTokenPrice = latestExchangeRate.rate.simple * massetPrice.value

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

export const VaultRow: FC<{ massetState: MassetState; showBalance: boolean }> = ({ massetState, showBalance }) => {
  const mAssetName = massetState.token.symbol.toLowerCase() as MassetName
  const massetPrice = useSelectedMassetPrice(mAssetName)
  const [selectedSaveVersion] = useSelectedSaveVersion()
  useSubscribeRewardStream(`reward-${mAssetName}`)

  const {
    savingsContracts: { v2: { boostedSavingsVault } = {} },
  } = massetState as MassetState

  const userBoost = useCalculateUserBoost(boostedSavingsVault)
  const apy = useSaveVaultAPY(mAssetName, userBoost)
  const saveApy = useAvailableSaveApy(mAssetName)
  const deposits = useMemo(
    () => getVaultDeposited(selectedSaveVersion, massetState, massetPrice.value),
    [massetPrice.value, massetState, selectedSaveVersion],
  )

  const btcTooltip = mAssetName === 'mbtc' ? 'Dollar value of BTC' : null
  const userBoostAPY = saveApy?.value + apy?.userBoost || 0
  const baseAPY = saveApy?.value + apy?.base || 0
  const maxAPY = saveApy?.value + apy?.maxBoost || 0
  const userBoostTip = `Combined APY<br>Vault: ${saveApy?.value?.toFixed(2) || 0}%<br>Rewards: ${apy?.userBoost?.toFixed(2) || 0}%`
  const baseAPYTip = `Base APY<br>Vault: ${saveApy?.value?.toFixed(2) || 0}%<br>Rewards: ${apy?.base?.toFixed(2) || 0}%`
  const maxAPYTip = `Maximum APY<br>Vault: ${saveApy?.value?.toFixed(2) || 0}%<br>Rewards: ${apy?.maxBoost?.toFixed(2) || 0}%`

  return (
    <DashTableRow>
      <DashNameTableCell>
        <TokenIcon symbol={massetState.token.symbol} />
        <Link to={`/${mAssetName}/save`}>{massetState.token.symbol}</Link>
      </DashNameTableCell>
      <DashTableCell>
        {userBoost > 1 && apy?.userBoost ? (
          <Tooltip hideIcon tip={userBoostTip}>
            <CountUp end={userBoostAPY} suffix="%" />
          </Tooltip>
        ) : (
          <>
            <Tooltip hideIcon tip={baseAPYTip}>
              <CountUp end={baseAPY} />
            </Tooltip>
            &nbsp;-&nbsp;
            <Tooltip hideIcon tip={maxAPYTip}>
              <CountUp end={maxAPY} suffix="%" />
            </Tooltip>
          </>
        )}
      </DashTableCell>
      {showBalance && (
        <DashTableCell>
          <Tooltip tip={btcTooltip} hideIcon>
            <CountUp end={deposits.simple} prefix="$" />
          </Tooltip>
        </DashTableCell>
      )}
      <DashTableCell>
        <CountUpUSD end={massetState.token.totalSupply.simple} price={massetPrice.value} formattingFn={toK} />
      </DashTableCell>
    </DashTableRow>
  )
}
