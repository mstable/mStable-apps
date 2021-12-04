export const mapIdToDial = (dialId: number) =>
  [
    { title: 'MTA Staking', key: 'stk-mta' },
    { title: 'mBPT Staking', key: 'stk-bpt' },
    { title: 'imUSD Vault', key: 'imusd-vault' },
    { title: 'imBTC Vault', key: 'imbtc-vault' },
  ][dialId]

export const scaleUserDials = (dials: Record<string, number>): Record<string, number> => {
  if (!Object.values(dials ?? {}).length) return {}

  const nonZeroDials = Object.values(dials).filter(v => !!v)
  const cumulativeWeight = nonZeroDials.reduce((a, b) => a + b, 0)

  // Scale only if total > 100
  if (cumulativeWeight <= 100) return dials

  const weightMultiplier = cumulativeWeight / 100
  const scaledUserDials = Object.keys(dials)
    .map(k => ({ [k]: !!dials[k] ? Math.floor(dials[k] / weightMultiplier) : 0 }))
    .reduce((a, b) => ({ ...a, ...b }), {})

  // TODO: Improve logic
  // remainder gets added to highest value
  const remainder = 100 - Object.values(scaledUserDials).reduce((a, b) => a + b)
  if (remainder > 0) {
    const values = Object.values(scaledUserDials)
    const scaledHighestKey = Object.keys(scaledUserDials).find(k => scaledUserDials[k] === Math.max(...values))
    const correctedForRemainder = Object.keys(scaledUserDials)
      .map(k => ({
        [k]: scaledUserDials[k] + (k === scaledHighestKey ? remainder : 0),
      }))
      .reduce((a, b) => ({ ...a, ...b }))
    return correctedForRemainder
  }
  return scaledUserDials
}

export const scaleDials = (dials: { title: string; value: number; key: string }[]): { title: string; value: number; key: string }[] => {
  if (!dials.length) return []

  const nonZeroDials = dials.filter(v => !!v.value)
  const cumulativeWeight = nonZeroDials.reduce((a, b) => a + b.value, 0)
  const weightMultiplier = cumulativeWeight / 100
  const scaledUserDials = dials.map(v => ({ ...v, value: v.value / weightMultiplier }))

  return scaledUserDials
}
