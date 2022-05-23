import { useState } from 'react'

import { Flippable, TabCard } from '@apps/dumb-components'

import { useOnboarding } from '../hooks'
import { OnboardingCard } from './Onboarding'
import { SaveDeposit } from './SaveDeposit'
import { SaveRedeem } from './SaveRedeem'

import type { FC } from 'react'

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
