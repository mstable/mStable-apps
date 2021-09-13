import React, { FC } from 'react'
import BaseTypist, { TypistProps } from 'react-typist'
import useSound from 'use-sound'

// @ts-ignore
import bleep30 from '../../../assets/bleeps_30.mp3'

export const Typist: FC<TypistProps> = ({ children, cursor = { show: false }, stdTypingDelay = 0, startDelay = 0, avgTypingDelay = 8 }) => {
  const [play] = useSound(bleep30, { volume: 0.08 })
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
