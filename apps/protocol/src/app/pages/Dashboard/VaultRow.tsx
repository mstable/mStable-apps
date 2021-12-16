import React, { FC, useMemo } from 'react'
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
import { useSelectedSaveVersion } from '../../context/SelectedSaveVersionProvider'
import { useAvailableSaveApy } from '../../hooks/useAvailableSaveApy'
import { useSelectedMassetPrice } from '../../hooks/useSelectedMassetPrice'
import { useSubscribeRewardStream } from './RewardsContext'
import { DashNameTableCell, DashTableCell, DashTableRow, RewardsApy } from './Styled'
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
  const history = useHistory()
  const mAssetName = massetState.token.symbol.toLowerCase() as MassetName
  const massetPrice = useSelectedMassetPrice(mAssetName)
  const [selectedSaveVersion] = useSelectedSaveVersion()
  useSubscribeRewardStream(`reward-${mAssetName}`)

  const {
    savingsContracts: { v2: { boostedSavingsVault } = {} },
  } = massetState as MassetState

  const userBoost = useCalculateUserBoost(boostedSavingsVault)
  const vaultApy = useSaveVaultAPY(mAssetName, userBoost)
  const saveApy = useAvailableSaveApy(mAssetName)
  const deposits = useMemo(
    () => getVaultDeposited(selectedSaveVersion, massetState, massetPrice.value),
    [massetPrice.value, massetState, selectedSaveVersion],
  )

  const btcTooltip = mAssetName === 'mbtc' ? 'Dollar value of BTC' : null
  const userBoostAPY = saveApy?.value + vaultApy?.userBoost || 0
  const baseAPY = saveApy?.value + vaultApy?.base || 0
  const maxAPY = saveApy?.value + vaultApy?.maxBoost || 0
  const userBoostTip = `Combined APY<br>Save: ${saveApy?.value?.toFixed(2) || 0}%<br>Vault Rewards: ${(userBoostAPY || 0).toFixed(2)}%`
  const apyTip = `Combined APY<br>Save: ${saveApy?.value?.toFixed(2) || 0}%<br>Vault Rewards:<br>${baseAPY?.toFixed(2)}-${maxAPY?.toFixed(
    2,
  )}%`

  return (
    <DashTableRow onClick={() => history.push(`/${mAssetName}/save`)} buttonTitle="Explore">
      <DashNameTableCell>
        <TokenIcon symbol={massetState.token.symbol} />
        {massetState.token.symbol}
      </DashNameTableCell>
      <DashTableCell>
        {deposits.simple > 0 ? (
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
