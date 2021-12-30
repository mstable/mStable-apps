import React, { useCallback, useRef, useState } from 'react'
import { useModal } from 'react-modal-hook'

import { Modal } from '@apps/dumb-components'

import { ExploreAsset } from '../components/wallet/ExploreAsset'

interface Props {
  symbol: string
  type: 'masset' | 'fasset' | 'basset'
}

export const useExploreAssetModal = (hidePrevModal?: () => void): [(asset: Props) => void, () => void] => {
  const [asset, setAsset] = useState<Props | undefined>(undefined)
  const actions = useRef<ReturnType<typeof useModal>>()
  const actions_ = actions.current

  const handleRowClick = useCallback(() => {
    actions.current?.[1]?.()
    hidePrevModal?.()
  }, [hidePrevModal])

  actions.current = useModal(
    ({ onExited, in: open }) => (
      <Modal title={asset?.symbol ?? 'Explore'} onExited={onExited} open={open} hideModal={actions_?.[1]}>
        <ExploreAsset symbol={asset?.symbol} type={asset?.type} onRowClick={handleRowClick} />
      </Modal>
    ),
    [asset],
  )

  const showModal = useCallback((_asset: Props) => {
    setAsset(_asset)
    actions.current?.[0]?.()
  }, [])

  return [showModal, (actions_ as ReturnType<typeof useModal>)?.[1]]
}
