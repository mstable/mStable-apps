import React, { useCallback, useRef, useState } from 'react'
import { useModal } from 'react-modal-hook'

import { Modal } from '@apps/dumb-components'

import { ExploreAsset } from '../components/wallet/ExploreAsset'

export const useExploreAssetModal = (hidePrevModal: () => void): [(symbol: string) => void, () => void] => {
  const [symbol, setSymbol] = useState<string | undefined>(undefined)
  const actions = useRef<ReturnType<typeof useModal>>()
  const actions_ = actions.current

  const handleRowClick = useCallback(() => {
    actions.current?.[1]?.()
    hidePrevModal()
  }, [hidePrevModal])

  actions.current = useModal(
    ({ onExited, in: open }) => (
      <Modal title={symbol ?? 'Explore'} onExited={onExited} open={open} hideModal={actions_?.[1]}>
        <ExploreAsset symbol={symbol} onRowClick={handleRowClick} />
      </Modal>
    ),
    [symbol],
  )

  const showModal = useCallback((_symbol: string) => {
    setSymbol(_symbol)
    actions.current?.[0]?.()
  }, [])

  return [showModal, (actions_ as ReturnType<typeof useModal>)?.[1]]
}
