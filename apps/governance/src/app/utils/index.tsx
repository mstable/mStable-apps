export const getRedemptionFee = (weeksStaked: number) => {
  let _feeRate = 0
  if (weeksStaked > 3) {
    _feeRate = Math.sqrt(300e18 / weeksStaked) * 1e7
    _feeRate = _feeRate < 25e15 ? 0 : _feeRate - 25e15
  } else {
    _feeRate = 75e15
  }
  return _feeRate / 1e16
}
