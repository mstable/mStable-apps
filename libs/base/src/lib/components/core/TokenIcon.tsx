import React, { FC, SVGProps } from 'react'
import styled from 'styled-components'

import MUSD, { ReactComponent as MusdSvg } from '@apps/icons/tokens/mUSD.svg'
import MBTC, { ReactComponent as MbtcSvg } from '@apps/icons/tokens/mBTC.svg'
import TUSD, { ReactComponent as TusdSvg } from '@apps/icons/tokens/TUSD.svg'
import USDT, { ReactComponent as UsdtSvg } from '@apps/icons/tokens/USDT.svg'
import USDC, { ReactComponent as UsdcSvg } from '@apps/icons/tokens/USDC.svg'
import DAI, { ReactComponent as DaiSvg } from '@apps/icons/tokens/DAI.svg'
import BUSD, { ReactComponent as BusdSvg } from '@apps/icons/tokens/BUSD.svg'
import SUSD, { ReactComponent as SusdSvg } from '@apps/icons/tokens/sUSD.svg'
import GUSD, { ReactComponent as GusdSvg } from '@apps/icons/tokens/GUSD.svg'
import CRV, { ReactComponent as CrvSvg } from '@apps/icons/tokens/CRV.svg'
import MUSD3CRV, { ReactComponent as Musd3CrvSvg } from '@apps/icons/tokens/musd3CRV.svg'
import Curve3Pool, { ReactComponent as Curve3PoolSvg } from '@apps/icons/tokens/3pool.svg'
import MTA, { ReactComponent as MtaSvg } from '@apps/icons/tokens/MTA.svg'
import Uniswap, { ReactComponent as UniswapSvg } from '@apps/icons/tokens/Uniswap.svg'
import Balancer, { ReactComponent as BalancerSvg } from '@apps/icons/tokens/Balancer.svg'
import BPTMTAETH, { ReactComponent as BptMtaEthSvg } from '@apps/icons/tokens/BPT-MTA-ETH.svg'
import ETH, { ReactComponent as EtherSvg } from '@apps/icons/tokens/Ether.svg'
import IMUSD, { ReactComponent as ImusdSvg } from '@apps/icons/tokens/imUSD.svg'
import IMBTC, { ReactComponent as ImbtcSvg } from '@apps/icons/tokens/imBTC.svg'
import VMTA, { ReactComponent as VmtaSvg } from '@apps/icons/tokens/vMTA.svg'
import RENBTC, { ReactComponent as RenbtcSvg } from '@apps/icons/tokens/renBTC.svg'
import WBTC, { ReactComponent as WbtcSvg } from '@apps/icons/tokens/wBTC.svg'
import SBTC, { ReactComponent as SbtcSvg } from '@apps/icons/tokens/sBTC.svg'
import IMUSDMTA, { ReactComponent as ImusdmtaSvg } from '@apps/icons/tokens/imusd-mta.svg'
import Sushi, { ReactComponent as SushiSvg } from '@apps/icons/tokens/Sushi.svg'
import BADGER, { ReactComponent as BadgerSvg } from '@apps/icons/tokens/Badger.svg'
import CREAM, { ReactComponent as CreamSvg } from '@apps/icons/tokens/Cream.svg'
import FAKE, { ReactComponent as FakeSvg } from '@apps/icons/tokens/FAKE.svg'
import HBTC, { ReactComponent as HbtcSvg } from '@apps/icons/tokens/HBTC.svg'
import TBTC, { ReactComponent as TbtcSvg } from '@apps/icons/tokens/tBTC.svg'
import VAULT, { ReactComponent as VaultSvg } from '@apps/icons/tokens/vault.svg'
import IMBTCMTA, { ReactComponent as ImbtcmtaSvg } from '@apps/icons/tokens/imbtc-mta.svg'
import FRAX, { ReactComponent as FraxSvg } from '@apps/icons/tokens/FRAX.svg'
import FXS, { ReactComponent as FxsSvg } from '@apps/icons/tokens/FXS.svg'
import ALUSD, { ReactComponent as AlusdSvg } from '@apps/icons/tokens/alUSD.svg'
import ALCX, { ReactComponent as AlcxSvg } from '@apps/icons/tokens/ALCX.svg'
import RAI, { ReactComponent as RaiSvg } from '@apps/icons/tokens/RAI.svg'
import FEI, { ReactComponent as FeiSvg } from '@apps/icons/tokens/FEI.svg'
import FLX, { ReactComponent as FlxSvg } from '@apps/icons/tokens/FLX.svg'
import ETHEREUM, { ReactComponent as EthereumSvg } from '@apps/icons/networks/Ethereum.svg'
import POLYGON, { ReactComponent as PolygonSvg } from '@apps/icons/networks/Polygon.svg'

import { Networks, useNetwork } from '../../context/NetworkProvider'

interface Props {
  className?: string
  symbol?: string
  hideNetwork?: boolean
}

type SvgProps = Props & SVGProps<never>

type SvgComponent = FC<SVGProps<never>>

export const TOKEN_ICONS: Record<string, string> = {
  ETH,
  WETH: ETH,
  MUSD,
  MBTC,
  TUSD,
  USDT,
  USDC,
  DAI,
  BUSD,
  MTA,
  SUSD,
  CRV,
  '3POOL': Curve3Pool,
  MUSD3CRV,
  'UNI-V2': Uniswap,
  BAL: Balancer,
  BPT: BPTMTAETH,
  MBPT: BPTMTAETH,
  TMBPT: BPTMTAETH,
  'MK-MTA': MTA,
  'MK-BAL': Balancer,
  IMUSD,
  'V-IMUSD': VAULT,
  VMTA,
  RENBTC,
  WBTC,
  SBTC,
  IMBTC,
  'V-IMBTC': VAULT,
  IMUSDMTA,
  SUSHI: Sushi,
  SLP: Sushi,
  BADGER,
  CREAM,
  IMBTCMTA,
  FAST: FAKE,
  GUSD,
  HBTC,
  TBTC,
  TBTCV2: TBTC,
  FPMUSD: MUSD,
  FPMBTC: MUSD,
  VAULT,
  ETHEREUM,
  POLYGON,
  FRAX,
  MATIC: POLYGON,
  WMATIC: POLYGON,
  FXS,
  ALUSD,
  ALCX,
  RAI,
  FLX,
  FEI,
}

const SVG_ICONS: Record<string, SvgComponent> = {
  ETH: EtherSvg as SvgComponent,
  WETH: EtherSvg as SvgComponent,
  MUSD: MusdSvg as SvgComponent,
  FPMUSD: MusdSvg as SvgComponent,
  MBTC: MbtcSvg as SvgComponent,
  TUSD: TusdSvg as SvgComponent,
  USDT: UsdtSvg as SvgComponent,
  USDC: UsdcSvg as SvgComponent,
  DAI: DaiSvg as SvgComponent,
  BUSD: BusdSvg as SvgComponent,
  SUSD: SusdSvg as SvgComponent,
  CRV: CrvSvg as SvgComponent,
  '3POOL': Curve3PoolSvg as SvgComponent,
  MUSD3CRV: Musd3CrvSvg as SvgComponent,
  MTA: MtaSvg as SvgComponent,
  'UNI-V2': UniswapSvg as SvgComponent,
  BAL: BalancerSvg as SvgComponent,
  BPT: BptMtaEthSvg as SvgComponent,
  'MK-MTA': MtaSvg as SvgComponent,
  'MK-BAL': BalancerSvg as SvgComponent,
  IMUSD: ImusdSvg as SvgComponent,
  'V-IMUSD': ImusdSvg as SvgComponent,
  VMTA: VmtaSvg as SvgComponent,
  RENBTC: RenbtcSvg as SvgComponent,
  WBTC: WbtcSvg as SvgComponent,
  SBTC: SbtcSvg as SvgComponent,
  IMBTC: ImbtcSvg as SvgComponent,
  IMUSDMTA: ImusdmtaSvg as SvgComponent,
  SUSHI: SushiSvg as SvgComponent,
  SLP: SushiSvg as SvgComponent,
  BADGER: BadgerSvg as SvgComponent,
  CREAM: CreamSvg as SvgComponent,
  IMBTCMTA: ImbtcmtaSvg as SvgComponent,
  FAST: FakeSvg as SvgComponent,
  GUSD: GusdSvg as SvgComponent,
  HBTC: HbtcSvg as SvgComponent,
  TBTC: TbtcSvg as SvgComponent,
  TBTCV2: TbtcSvg as SvgComponent,
  VAULT: VaultSvg as SvgComponent,
  ETHEREUM: EthereumSvg as SvgComponent,
  POLYGON: PolygonSvg as SvgComponent,
  MATIC: PolygonSvg as SvgComponent,
  FRAX: FraxSvg as SvgComponent,
  FXS: FxsSvg as SvgComponent,
  ALUSD: AlusdSvg as SvgComponent,
  ALCX: AlcxSvg as SvgComponent,
  RAI: RaiSvg as SvgComponent,
  FLX: FlxSvg as SvgComponent,
  FEI: FeiSvg as SvgComponent,
}

const IconContainer = styled.div<{ isLarge: boolean }>`
  display: flex;

  img {
    height: ${({ isLarge }) => (isLarge ? `2.5rem` : `2rem`)};
    width: ${({ isLarge }) => (isLarge ? `2.5rem` : `2rem`)};
  }

  > div:last-child {
    margin-left: -0.7rem;
  }
`

const PathContainer = styled(IconContainer)`
  align-items: center;
  font-size: 1.5rem;

  > span {
    margin: 0 0.5rem 0 0.3rem;
  }

  > img:last-child {
    margin-left: 0;
  }
`

const NetworkIcon = styled.img`
  position: absolute;
  width: 1rem !important;
  height: 1rem !important;
  right: -0.125rem;
  bottom: 0;
  z-index: 1;
`

const Image = styled.img`
  width: 100%;
  height: auto;
`

const ImageContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const PlaceholderIcon = styled.div`
  border-radius: 100%;
  min-width: 2rem;
  min-height: 2rem;
  background: grey;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.7rem;
  white-space: nowrap;
  text-shadow: black 0 1px 1px;
`

export const TokenIcon: FC<Props> = ({ className, symbol, hideNetwork = true }) => {
  const { protocolName } = useNetwork()
  const networkSymbol = protocolName.toUpperCase()
  const showNetworkIcon = symbol && protocolName !== Networks.Ethereum && !hideNetwork
  const icon = TOKEN_ICONS[symbol?.toUpperCase() ?? '']
  return icon ? (
    <ImageContainer className={className}>
      <Image alt={symbol} src={icon} />
      {showNetworkIcon && <NetworkIcon src={TOKEN_ICONS[networkSymbol]} alt="" />}
    </ImageContainer>
  ) : (
    <PlaceholderIcon className={className} title={symbol}>
      {symbol}
    </PlaceholderIcon>
  )
}

export const TokenPair: FC<{
  symbols?: string[]
  className?: string
  isLarge?: boolean
}> = ({ className, symbols, isLarge = false }) => {
  if (!symbols || (symbols?.length ?? 0) < 2) return null
  return (
    <IconContainer isLarge={isLarge} className={className}>
      <TokenIcon symbol={symbols[0]} />
      <TokenIcon symbol={symbols[1]} />
    </IconContainer>
  )
}

export const TokenPath: FC<{
  symbols: string[]
  className?: string
}> = ({ className, symbols }) => {
  return (
    <PathContainer isLarge={false} className={className}>
      <TokenIcon symbol={symbols[0]} />
      <span>→</span>
      <TokenIcon symbol={symbols[1]} />
    </PathContainer>
  )
}

export const TokenIconSvg: FC<SvgProps> = ({ symbol, width, height, x, y, className }) => {
  if (!symbol || !SVG_ICONS[symbol.toUpperCase()]) return null
  const Icon = SVG_ICONS[symbol.toUpperCase()]
  return <Icon width={width} height={height} x={x} y={y} className={className} />
}
