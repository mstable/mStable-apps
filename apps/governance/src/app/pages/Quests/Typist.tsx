import { useSound } from '@apps/browser-settings'
import BaseTypist from 'react-typist'

// @ts-ignore
import bleep30 from '../../../assets/bleeps_30.mp3'

import type { FC } from 'react'
import type { TypistProps } from 'react-typist'

export const Typist: FC<TypistProps> = ({ children, cursor = { show: false }, stdTypingDelay = 0, startDelay = 0, avgTypingDelay = 8 }) => {
  const [play] = useSound(bleep30, { volume: 0.05, playbackRate: 0.9 + Math.min(0.2, Math.random()) })
  return (
    <BaseTypist
      startDelay={startDelay}
      avgTypingDelay={avgTypingDelay}
      stdTypingDelay={stdTypingDelay}
      cursor={cursor}
      onLineTyped={play as never}
    >
      {children}
    </BaseTypist>
  )
}
