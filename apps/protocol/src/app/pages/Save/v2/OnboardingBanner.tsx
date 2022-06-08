import { Button, CountUp, Tooltip } from '@apps/dumb-components'
import { useSelectedMassetName } from '@apps/masset-provider'
import { ViewportWidth } from '@apps/theme'
import styled from 'styled-components'

import { DailyApys } from '../../../components/stats/DailyApys'
import { useSelectedSaveVersion } from '../../../context/SelectedSaveVersionProvider'
import { useAvailableSaveApy } from '../../../hooks/useAvailableSaveApy'
import { useOnboarding } from '../hooks'

import type { FC } from 'react'

const APYChart = styled(DailyApys)`
  position: relative;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  border-radius: 1rem;
  overflow: hidden;
`

const ApyTip = styled(Tooltip)`
  font-weight: 600;
  font-size: 1.25rem;
  pointer-events: all;

  > span > span {
    font-weight: normal;
    font-size: 1.125rem;
  }
`

const ApyTitle = styled.div`
  font-weight: normal;
  font-size: 0.75rem;
`

const APYText = styled.div`
  user-select: none;
  pointer-events: none;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  padding: 1rem 1rem 0;
  font-size: 1.25rem;
`

const InfoLink = styled.div`
  position: absolute;
  right: 1rem;
  top: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.color.background[2]};
  border-radius: 1rem;
  height: 2rem;
  width: 2rem;
  ${({ theme }) => theme.mixins.numeric};

  a {
    pointer-events: auto;
    height: 1.5rem;
    text-align: center;
    color: ${({ theme }) => theme.color.body};
    font-size: 1.125rem;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;

  > div {
    flex: 1;
  }

  > div:first-child {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    background: ${({ theme }) => `linear-gradient(180deg, rgba(210,172,235,0.3) 0%, ${theme.color.background[0]} 100%)`};
    border-radius: 1rem;
    padding: 1.5rem;
    border: 1px solid ${({ theme }) => theme.color.defaultBorder};

    button {
      border-color: rgba(210, 172, 235, 0.25);
      background: rgba(210, 172, 235, 0.1);
      font-size: 0.875rem;

      span {
        opacity: 0.675;
      }
    }

    button:hover {
      span {
        opacity: 1;
      }
    }

    > * {
      z-index: 1;
    }

    h2 {
      font-size: 1.25rem;
      line-height: 2rem;
      font-weight: 600;
      color: ${({ theme }) => theme.color.body};
    }

    h3 {
      font-size: 1rem;
      line-height: 1.75rem;
      color: ${({ theme }) => theme.color.body};
      opacity: 0.675;
    }
  }

  > div:last-child {
    position: relative;
    z-index: 1;
  }

  @media (min-width: ${ViewportWidth.l}) {
    flex-direction: row;
    justify-content: space-between;

    max-height: 10rem;

    > div {
      flex: 0;
    }

    > div:first-child {
      flex-basis: calc(65% - 0.5rem);
      margin-bottom: 0;

      button {
        margin-top: 0.25rem;
      }
    }

    > div:last-child {
      flex-basis: calc(35% - 0.5rem);
    }
  }
`

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  > * :not(:last-child) {
    margin-right: 0.5rem;
  }
`

export const OnboardingBanner: FC = () => {
  const saveApy = useAvailableSaveApy()
  const [onboarding, toggleOnboarding] = useOnboarding()
  const massetName = useSelectedMassetName()
  const [selectedSaveVersion] = useSelectedSaveVersion()
  const isSaveV1 = selectedSaveVersion === 1

  return (
    <Container>
      <div>
        <div>
          <h2>{massetName === 'mbtc' ? 'Start earning yield on your BTC in DeFi.' : 'Start earning yield on your stablecoins.'}</h2>
          <h3>Powered by lending markets in DeFi and the mStable AMM.</h3>
        </div>
        <ButtonContainer>
          {!isSaveV1 && (
            <Button onClick={toggleOnboarding}>
              <span>{onboarding ? 'Back to form' : 'How to use Save'}</span>
            </Button>
          )}
          <Button
            onClick={() => {
              window.open('https://docs.mstable.org/advanced/app-usage-terms-and-conditions')
            }}
          >
            Risks ↗
          </Button>
        </ButtonContainer>
      </div>
      <div>
        <APYChart hideControls shimmerHeight={150} tick={false} marginTop={56} aspect={2.07} color="#d2aceb" />
        <APYText>
          <ApyTip tip={'This APY is derived from internal swap fees and lending markets, and is not reflective of future rates.'}>
            <CountUp end={saveApy.value ?? 0} suffix="%" />
          </ApyTip>
          <ApyTitle>
            {saveApy.type === 'average' ? `APY${saveApy.days ? ` (${saveApy.days}-day MA)` : ''}` : 'APY (live/unstable)'}
          </ApyTitle>
          <Tooltip tip="Learn about how this is calculated" hideIcon>
            <InfoLink>
              <a
                href="https://docs.mstable.org/using-mstable/mstable-app/save#understanding-save"
                target="_blank"
                rel="noopener noreferrer"
              >
                ↗
              </a>
            </InfoLink>
          </Tooltip>
        </APYText>
      </div>
    </Container>
  )
}
