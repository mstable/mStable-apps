import React, { FC, useState } from 'react'
import styled from 'styled-components'

const StakeValidationForm = styled.div`
  p {
    color: ${({ theme }) => theme.color.bodyAccent};
    font-size: 0.8rem;
    line-height: 1.2rem;
    margin-left: 0.3rem;
    white-space: pre-line;
  }
  ul {
    color: ${({ theme }) => theme.color.bodyAccent};
    font-size: 0.8rem;
    line-height: 1.2rem;
    list-style: disc;
  }

  li {
    margin-left: 1.75rem;
  }
  h3 {
    margin-left: 0.25rem;
    display: flex;
    align-items: center;
  }
`

interface StakeValidationProps {
  isStakeSigned: boolean
  setIsStakeSigned: React.Dispatch<React.SetStateAction<boolean>>
  signMsg: string
}



export const StakeValidation: FC<StakeValidationProps> = ({ isStakeSigned, setIsStakeSigned, signMsg }) => {
  const handleCheckbox = () => {
    setIsStakeSigned(!isStakeSigned)
  }

  return (
    <StakeValidationForm>
      <input type="checkbox" checked={isStakeSigned} onChange={handleCheckbox} />
      <label onClick={handleCheckbox}>Terms and Conditions</label>
      <p>{signMsg}</p>
    </StakeValidationForm>
  )
}
