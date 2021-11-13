import React, { FC, useState } from 'react'
import styled from 'styled-components'

const StakeValidationSC = styled.div`
  p {
    color: ${({ theme }) => theme.color.bodyAccent};
    font-size: 0.8rem;
    line-height: 1.2rem;
    margin-left: 0.3rem;
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
}

export const SIGN_MSG = `I acknowledge that by staking my MTA, I become a member of the mStable DAO. As a member of the mStableDAO, I am committed to:

- supporting decisions and acting in ways that help the protocol achieve its vision of becoming a piece of decentralised, public
- financial infrastructure for the world.
- engaging in reasonable and respectful debate on governance items with other members of the DAO and the broader community
- stabilising weak hands
`

export const StakeValidation: FC<StakeValidationProps> = ({ isStakeSigned, setIsStakeSigned }) => {
  const handleCheckbox = () => {
    setIsStakeSigned(!isStakeSigned)
  }

  return (
    <StakeValidationSC>
      <input type="checkbox" checked={isStakeSigned} onChange={handleCheckbox} />
      <label onClick={handleCheckbox}>Terms and Conditions</label>
      <p>I acknowledge that by staking my MTA, I become a member of the mStable DAO. As a member of the mStableDAO, I am committed to:</p>
      <ul>
        <li>
          supporting decisions and acting in ways that help the protocol achieve its vision of becoming a piece of decentralised, public
          financial infrastructure for the world.
        </li>
        <li>engaging in reasonable and respectful debate on governance items with other members of the DAO and the broader community</li>
        <li>stabilising weak hands</li>
      </ul>
    </StakeValidationSC>
  )
}
