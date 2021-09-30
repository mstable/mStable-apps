const DAY = 86400

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

// FIXME: - hardcoded to be monday, would be good to get better precision
export const getDaysUntilQueueUpdate = () => {
  const today = new Date()
  const monday = today.setDate(today.getDate() + ((7 - today.getDay()) % 7) + 1)
  return Math.floor((monday - Date.now()) / DAY / 1000)
}
