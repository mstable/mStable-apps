import React, { FC } from 'react'
import BaseTypist, { TypistProps } from 'react-typist'

const cursor = { show: false }

export const Typist: FC<TypistProps> = ({ children }) => {
  return (
    <BaseTypist startDelay={0} avgTypingDelay={8} stdTypingDelay={0} cursor={cursor}>
      {children}
    </BaseTypist>
  )
}
