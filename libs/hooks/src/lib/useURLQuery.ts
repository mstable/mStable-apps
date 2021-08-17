import { useLocation } from 'react-router-dom'

export const useURLQuery = () => new URLSearchParams(useLocation().search)
