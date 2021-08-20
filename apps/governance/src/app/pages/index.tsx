import React, { FC } from 'react'
import styled from 'styled-components'

import img from '../../../../../libs/assets/metanaut.gif'

const Container = styled.div`
  h3 {
    padding: 1rem;
    font-size: 1.4rem;
    margin-bottom: 1rem;
    font-weight: 500;
  }

  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .quest {
    padding: 1rem;
    background: linear-gradient(333.23deg, #8b1e59 30.23%, #e364b8 135.17%);
    border-radius: 18px;
    color: white;

    .header {
      display: flex;
      flex-direction: column;
      justify-content: center;

      h4 {
        font-weight: bold;
      }

      @keyframes rotating {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      img {
        animation: rotating 32s linear infinite;
        align-self: center;
      }
    }

    .details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .multiplier {
        border-radius: 16px;
        background: linear-gradient(180deg, #e1329e 0%, #e12298 100%);
        box-shadow: 0 4px 10px #811850;
        font-size: 1.1rem;
        padding: 0.5rem 1rem;
      }
      .type {
        align-self: flex-end;
        font-size: 0.9rem;
      }
    }

    img {
      width: 168px;
      height: auto;
    }
  }
`

// TODO
// Proper components, kill these classnames, etc
// Just for drafting ideas
export const Home: FC = () => {
  return (
    <div>
      <Container>
        <h3>My quests</h3>
        <div>
          <div className="quest permanent">
            <div className="header">
              <h4>Migrated Staking</h4>
              <p>Metanauts assemble! You don't mess around.</p>
              <img src={img} />
            </div>
            <div className="details">
              <div className="type">Permanent</div>
              <div className="multiplier">+1.2x</div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
