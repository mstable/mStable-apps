import { useLocalStorage } from 'react-use'

export interface StakeSignatures {
  [x: string]: string
}

// Hook
export const useStakeSignatures = () => {
  const [stakeSignatures, setStakeSignatures] = useLocalStorage<StakeSignatures>('stakeSignatures', {})

  return [
    stakeSignatures,
    setStakeSignatures,
    // small hack because the returned types are wrong: https://github.com/streamich/react-use/pull/1438
  ] as [StakeSignatures, React.Dispatch<React.SetStateAction<StakeSignatures>>]
}
