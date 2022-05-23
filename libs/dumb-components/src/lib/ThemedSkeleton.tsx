/* eslint-disable react/jsx-props-no-spreading */
import { useIsDarkMode } from '@apps/browser-settings'
import { colorTheme } from '@apps/theme'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

import type { ComponentProps, FC } from 'react'

export const ThemedSkeleton: FC<ComponentProps<typeof Skeleton> & { className?: string }> = props => {
  const isDarkTheme = useIsDarkMode()
  const theme = colorTheme(isDarkTheme)
  const { className } = props
  return (
    <div className={className}>
      <SkeletonTheme color={theme.background[2]} highlightColor={theme.background[0]}>
        <Skeleton {...props} />
      </SkeletonTheme>
    </div>
  )
}
