import { useLocation } from 'react-router-dom'

export const useCheckPath = (path: string): boolean => {
  const location = useLocation()
  return location.pathname.includes(path)
}
