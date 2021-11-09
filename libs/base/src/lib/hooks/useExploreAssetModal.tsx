import React, { useCallback, useState } from 'react'
import { useModal } from 'react-modal-hook'

import { Modal } from '@apps/dumb-components'

import { ExploreAsset } from '../components/wallet/ExploreAsset'

export const useExploreAssetModal = (hidePrevModal: () => void): [(symbol: string) => void, () => void] => {
  const [symbol, setSymbol] = useState<string | undefined>(undefined)

  const handleRowClick = useCallback(() => {
    hideModal()
    hidePrevModal()
  }, [])

  const [_showModal, hideModal] = useModal(
    ({ onExited, in: open }) => (
      <Modal title={symbol ?? 'Explore'} onExited={onExited} open={open} hideModal={hideModal}>
        <ExploreAsset symbol={symbol} onRowClick={handleRowClick} />
      </Modal>
    ),
    [symbol],
  )

  const showModal = useCallback(
    (_symbol: string) => {
      setSymbol(_symbol)
      _showModal()
    },
    [_showModal],
  )

  return [showModal, hideModal]
}
