import { useMemo } from 'react'

import { Dropdown } from '../core/Dropdown'

import type { AddressOption } from '@apps/types'
import type { FC } from 'react'

interface Props {
  defaultAddress?: string
  addressOptions: AddressOption[]
  onChange?: (address?: string) => void
  disabled?: boolean
  className?: string
}

export const AssetDropdown: FC<Props> = ({ defaultAddress, addressOptions, onChange, disabled, className }) => {
  const selected = useMemo<string | undefined>(
    () => addressOptions.find(option => defaultAddress === option.address)?.address,
    [addressOptions, defaultAddress],
  )

  const options = Object.fromEntries([
    ...addressOptions.map(v => [
      v?.address,
      {
        icon: { symbol: v?.symbol },
        asset: v,
      },
    ]),
  ])

  const handleSelect = (selectedTitle?: string): void => {
    if (!selectedTitle) return
    onChange?.(selectedTitle)
  }

  return <Dropdown className={className} onChange={handleSelect} options={options} defaultOption={selected} disabled={disabled} />
}
