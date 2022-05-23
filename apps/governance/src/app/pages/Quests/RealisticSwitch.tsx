import styled from 'styled-components'

import type { FC } from 'react'

const Label = styled.div`
  transform: rotate(90deg);
  width: 30px;
  height: 50px;
  perspective: 700px;
  margin-right: 20px;

  input {
    display: none;
  }

  input:checked + .button {
    transform: translateZ(10px) rotateX(12deg);
    box-shadow: 0 0 10px rgba(238, 255, 0, 0.5);
  }

  input:checked + .button .light {
    animation: flicker 0.2s infinite 0.3s;
  }

  input:checked + .button .shine {
    opacity: 1;
  }

  input:checked + .button .shadow {
    opacity: 0;
  }

  .button {
    transition: all 0.3s cubic-bezier(1, 0, 1, 1);
    transform-origin: center center -12px;
    transform: translateZ(12px) rotateX(-14deg);
    transform-style: preserve-3d;
    width: 100%;
    height: 100%;
    position: relative;
    cursor: pointer;
    background: #949b87 linear-gradient(#909381 0%, #7b8877 30%, #837f6f 70%, #009800 100%) no-repeat;
  }

  .light {
    opacity: 0;
    mix-blend-mode: overlay;
    animation: light-off 1s;
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    background-image: radial-gradient(#ecff81, #f1ff73 40%, transparent 70%);
  }

  .dots {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(transparent 30%, rgba(56, 101, 0, 0.7) 70%);
    background-size: 5px 5px;
  }

  .characters {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(white, white) 50% 20% / 5% 20%,
      radial-gradient(circle, transparent 50%, white 52%, white 70%, transparent 72%) 50% 80% / 33% 25%;
    background-repeat: no-repeat;
  }

  .shine {
    transition: all 0.3s cubic-bezier(1, 0, 1, 1);
    opacity: 0.3;
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(white, transparent 3%) 50% 50% / 97% 97%,
      linear-gradient(rgba(255, 255, 255, 0.5), transparent 50%, transparent 80%, rgba(255, 255, 255, 0.5)) 50% 50% / 97% 97%;
    background-repeat: no-repeat;
  }

  .shadow {
    transition: all 0.3s cubic-bezier(1, 0, 1, 1);
    opacity: 1;
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(transparent 70%, rgba(0, 0, 0, 0.8)) no-repeat;
  }

  @keyframes flicker {
    0% {
      opacity: 1;
    }
    80% {
      opacity: 0.8;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes light-off {
    0% {
      opacity: 1;
    }
    80% {
      opacity: 0;
    }
  }
`

export const RealisticSwitch: FC<{ onClick?: () => void; checked: boolean }> = ({ onClick, checked }) => (
  <Label onClick={onClick}>
    <input type="checkbox" onChange={() => {}} checked={checked} />
    <div className="button">
      <div className="light" />
      <div className="dots" />
      <div className="characters" />
      <div className="shine" />
      <div className="shadow" />
    </div>
  </Label>
)
