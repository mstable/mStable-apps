import React, { FC } from 'react'
import BaseTypist, { TypistProps } from 'react-typist'

import { useSound } from '@apps/browser-settings'

// @ts-ignore
import bleep30 from '../../../assets/bleeps_30.mp3'

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
