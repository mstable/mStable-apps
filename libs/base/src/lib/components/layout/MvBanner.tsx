import { ButtonExternal } from '@apps/dumb-components'
import { ReactComponent as Metavault } from '@apps/icons/metavault.svg'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`

const Border = styled.div`
  position: relative;
  background: linear-gradient(
    125deg,
    rgba(157, 149, 255, 0.6) 0%,
    rgba(250, 195, 113, 0.6) 25%,
    rgba(85, 213, 255, 0.6) 50%,
    rgba(251, 136, 215, 0.6) 75%
  );
  background-size: 100%;
  border-radius: 1rem;
  min-width: 420px;
  height: 60px;
`

const Inner = styled.div`
  position: absolute;
  top: 1px;
  right: 1px;
  bottom: 1px;
  left: 1px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  column-gap: 1rem;
  background: ${({ theme }) => theme.color.background[0]};
  border-radius: inherit;
`

const MvLogo = styled(Metavault)`
  width: 42px;
  height: 42px;
`

export const MvBanner = () => {
  return (
    <Container>
      <Border>
        <Inner>
          <MvLogo />
          Meta Vaults are now live!
          <ButtonExternal highlighted onClick={() => window.open('https://yield.mstable.org')}>
            Use App
          </ButtonExternal>
        </Inner>
      </Border>
    </Container>
  )
}
