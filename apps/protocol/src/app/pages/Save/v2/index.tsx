import React, { FC, useState } from 'react'

import { TabCard, Flippable } from '@apps/components/core'

import { useOnboarding } from '../hooks'
import { SaveDeposit } from './SaveDeposit'
import { SaveRedeem } from './SaveRedeem'
import { OnboardingCard } from './Onboarding'

enum Tabs {
  Deposit = 'Deposit',
  Redeem = 'Redeem',
}

const tabs = {
  [Tabs.Deposit]: {
    title: `Deposit`,
    component: <SaveDeposit />,
  },
  [Tabs.Redeem]: {
    title: `Redeem`,
    component: <SaveRedeem />,
  },
}

export const Save: FC = () => {
  const [activeTab, setActiveTab] = useState<string>(Tabs.Deposit as string)
  const [onboarding] = useOnboarding()

  return (
    <Flippable
      flipped={onboarding}
      front={<TabCard tabs={tabs} active={activeTab} onClick={setActiveTab} />}
      obverse={<OnboardingCard />}
    />
  )
}
