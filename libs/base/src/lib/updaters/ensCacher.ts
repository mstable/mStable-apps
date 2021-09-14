import { useEffect } from 'react'

import { useENSState } from '../context/ENSProvider'

export const ENSCacher = (): null => {
  const [state] = useENSState()

  useEffect(() => {
    localStorage.setItem('ENSCache', JSON.stringify(state))
  }, [state])

  return null
}
