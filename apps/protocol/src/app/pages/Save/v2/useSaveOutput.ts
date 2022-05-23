import { useEffect } from 'react'

import { FeederPool__factory, IUniswapV2Router02__factory, Masset__factory, SaveWrapper__factory } from '@apps/artifacts/typechain'
import { useSigner } from '@apps/base/context/account'
import { useNetworkAddresses, useNetworkPrices } from '@apps/base/context/network'
import { useTokenSubscription } from '@apps/base/context/tokens'
import { BigDecimal } from '@apps/bigdecimal'
import { sanitizeMassetError } from '@apps/formatters'
import { useFetchState } from '@apps/hooks'
import { useSelectedMassetState } from '@apps/masset-hooks'
import { getPriceImpact } from '@apps/quick-maths'
import { useDebounce } from 'react-use'

import { useMassetInputRatios } from '../../../hooks/useMassetInputRatios'
import { useScaledInput } from '../../../hooks/useScaledInput'
import { useSelectedMassetPrice } from '../../../hooks/useSelectedMassetPrice'
import { SaveRoutes } from './types'

import type { AllNetworks } from '@apps/base/context/network'
import type { MassetState } from '@apps/data-provider'
import type { BigDecimalInputValue } from '@apps/hooks'
import type { FetchState, ScaledInput } from '@apps/types'
import type { Signer } from 'ethers'
import type { BigNumber } from 'ethers'

import type { SaveOutput } from './types'

const getOptimalBasset = async (
  signer: Signer,
  networkAddresses: AllNetworks['addresses'],
  massetAddress: string,
  bAssets: MassetState['bAssets'],
  inputAmount: BigNumber,
): Promise<SaveOutput> => {
  const wrappedNativeToken =
    (networkAddresses.ERC20 as Extract<AllNetworks['addresses'], { ERC20: { WETH: string } }>['ERC20']).WETH ??
    (networkAddresses.ERC20 as Extract<AllNetworks['addresses'], { ERC20: { wMATIC: string } }>['ERC20']).wMATIC

  const uniswap = IUniswapV2Router02__factory.connect(networkAddresses.UniswapRouter02_Like, signer)

  const saveWrapper = SaveWrapper__factory.connect(networkAddresses.SaveWrapper, signer)

  const bassetAmountsOut = [
    ...(await Promise.all(
      Object.keys(bAssets).map(async address => {
        const path = [wrappedNativeToken, address]
        try {
          const [, amountOut] = await uniswap.getAmountsOut(inputAmount, path)
          const estimatedOutput = await saveWrapper.estimate_saveViaUniswapETH(
            massetAddress,
            networkAddresses.UniswapRouter02_Like,
            inputAmount,
            path,
          )

          return {
            path,
            amountOut: new BigDecimal(amountOut, bAssets[address].token.decimals),
            amount: new BigDecimal(estimatedOutput),
          }
        } catch (error) {
          console.error(`Error estimating output for path ${path.join(',')}`, error)
        }
      }),
    )),
  ].filter(Boolean) as SaveOutput[]

  const optimal = bassetAmountsOut.reduce((prev, current) => (current.amount.exact.gt(prev.amount.exact) ? current : prev), {
    amount: BigDecimal.ZERO,
  })

  if (!optimal || optimal.amount.exact.eq(0)) {
    throw new Error('No path found')
  }

  return optimal
}

const toScaledInputJSON = (scaledInput?: ScaledInput): string | undefined =>
  scaledInput ? JSON.stringify(Object.fromEntries(Object.entries(scaledInput).map(([key, value]) => [key, value.toJSON()]))) : undefined

const fromScaledInputJSON = (string): ScaledInput =>
  Object.fromEntries(
    Object.entries(JSON.parse(string)).map(([key, value]) => [key, BigDecimal.fromJSON(value as string)]),
  ) as {} as ScaledInput

export const useSaveOutput = (route?: SaveRoutes, inputAddress?: string, inputAmount?: BigDecimal): FetchState<SaveOutput> => {
  const [saveOutput, setSaveOutput] = useFetchState<SaveOutput>()
  const networkAddresses = useNetworkAddresses()
  const networkPrices = useNetworkPrices()
  const nativeTokenPriceSimple = networkPrices.value?.nativeToken
  const selectedMassetPrice = useSelectedMassetPrice()

  const signer = useSigner() as Signer

  const massetState = useSelectedMassetState() as MassetState
  const {
    address: massetAddress,
    bAssets,
    feederPools,
    savingsContracts: {
      v2: { address: saveAddress, latestExchangeRate: { rate: latestExchangeRate } = {} },
    },
  } = massetState

  const inputToken = useTokenSubscription(inputAddress)
  const outputToken = useTokenSubscription(saveAddress)

  const inputRatios = useMassetInputRatios()
  const scaledInput = useScaledInput(
    { ...inputToken, amount: inputAmount } as BigDecimalInputValue,
    { ...outputToken, amount: BigDecimal.ZERO },
    inputRatios,
  )

  const scaledInputJSON = toScaledInputJSON(scaledInput)
  const feederPoolAddress = inputAddress && Object.values(feederPools).find(fp => fp.fasset.address === inputAddress)?.address

  const [update] = useDebounce(
    () => {
      if (!scaledInputJSON || !inputAddress || !signer) return setSaveOutput.value()

      const _scaledInput = fromScaledInputJSON(scaledInputJSON)

      if (
        !latestExchangeRate ||
        !networkAddresses ||
        !nativeTokenPriceSimple ||
        !selectedMassetPrice.value ||
        ((route === SaveRoutes.SwapAndSave || route === SaveRoutes.SwapAndStake) && !feederPoolAddress)
      ) {
        return setSaveOutput.fetching()
      }

      let promise: Promise<SaveOutput>
      switch (route) {
        case SaveRoutes.Save:
        case SaveRoutes.Stake:
        case SaveRoutes.SaveAndStake:
          promise = Promise.resolve({
            amount: _scaledInput.high,
          })
          break

        case SaveRoutes.BuyAndSave:
        case SaveRoutes.BuyAndStake:
          promise = (async () => {
            const [{ amount: low }, { amount: high, path, amountOut }] = await Promise.all([
              getOptimalBasset(signer, networkAddresses, massetAddress, bAssets, _scaledInput.low.exact),
              getOptimalBasset(signer, networkAddresses, massetAddress, bAssets, _scaledInput.high.exact),
            ])

            const nativeTokenPrice = BigDecimal.fromSimple(nativeTokenPriceSimple).exact
            const massetPrice = BigDecimal.fromSimple(selectedMassetPrice.value)

            const buyLow = _scaledInput.scaledLow.mulTruncate(nativeTokenPrice).divPrecisely(massetPrice)
            const buyHigh = _scaledInput.scaledHigh.mulTruncate(nativeTokenPrice).divPrecisely(massetPrice)

            const priceImpact = getPriceImpact([buyLow, buyHigh], [low, high])

            return {
              amount: high,
              amountOut,
              path,
              priceImpact,
            }
          })()
          break

        case SaveRoutes.MintAndSave:
        case SaveRoutes.MintAndStake:
          promise = (async () => {
            const contract = Masset__factory.connect(massetAddress, signer)

            const [_low, _high] = await Promise.all([
              contract.getMintOutput(inputAddress, _scaledInput.low.scale(scaledInput.high.decimals).exact),
              contract.getMintOutput(inputAddress, _scaledInput.high.exact),
            ])

            const low = new BigDecimal(_low)
            const high = new BigDecimal(_high)

            const priceImpact = getPriceImpact([_scaledInput.scaledLow, _scaledInput.scaledHigh], [low, high])

            return {
              amount: high,
              priceImpact,
            }
          })()
          break

        case SaveRoutes.SwapAndSave:
        case SaveRoutes.SwapAndStake:
          promise = (async () => {
            const contract = FeederPool__factory.connect(feederPoolAddress as string, signer)

            const [_low, _high] = await Promise.all([
              contract.getSwapOutput(inputAddress, massetAddress, _scaledInput.low.scale(scaledInput.high.decimals).exact),
              contract.getSwapOutput(inputAddress, massetAddress, _scaledInput.high.exact),
            ])

            const low = new BigDecimal(_low)
            const high = new BigDecimal(_high)

            const priceImpact = getPriceImpact([_scaledInput.scaledLow, _scaledInput.scaledHigh], [low, high])

            return {
              amount: high,
              priceImpact,
            }
          })()
          break

        default:
          return setSaveOutput.value()
      }

      setSaveOutput.fetching()

      return promise
        .then((output): void => {
          setSaveOutput.value(output)
        })
        .catch((_error: Error): void => {
          setSaveOutput.error(sanitizeMassetError(_error))
        })
    },
    1000,
    [scaledInputJSON, inputAddress, massetAddress, feederPoolAddress],
  )

  useEffect(() => {
    if (inputAmount?.exact.gt(0) && inputAddress) {
      setSaveOutput.fetching()
      update()
    } else {
      setSaveOutput.value()
    }
  }, [inputAddress, inputAmount, setSaveOutput, update])

  return saveOutput
}
