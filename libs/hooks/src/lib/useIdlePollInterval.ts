import { useMemo } from 'react'

import { useIdle } from 'react-use'

export const useIdlePollInterval = (pollInterval = 60e3) => {
  const idle = useIdle(pollInterval + 1e3)

  return useMemo(() => (idle ? 0 : pollInterval), [idle, pollInterval])
}
