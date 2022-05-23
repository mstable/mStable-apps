import { Address } from '@apps/base/components/core'
import { ChainIds, Networks } from '@apps/base/context/network'
import { ExternalLink, ToggleInput, Tooltip } from '@apps/dumb-components'
import styled from 'styled-components'

import { useShowVotesTable } from './context/ViewOptionsContext'

import type { FC } from 'react'

import type { Dial } from './types'

const Container = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.color.bodyTransparent};

  > div {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: flex-end;
  }

  .description {
    margin-bottom: 0.5rem;
    min-height: 4rem;
  }

  .links {
    display: flex;
    gap: 1rem;
  }

  .user-weights {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    > :first-child {
      font-size: 0.8rem;
      color: ${({ theme }) => theme.color.bodyTransparent};
      display: flex;
      gap: 1rem;
      align-items: center;
    }
  }
`

export const DialMetadataContent: FC<{ dial?: Dial }> = ({ dial, children }) => {
  const [showVotesTable, toggleShowVotesTable] = useShowVotesTable()

  if (!dial) {
    return <Container>{children}</Container>
  }

  return (
    <Container>
      <div>
        <p className="description">{dial.metadata?.description ?? ''}</p>
      </div>
      <div>
        <div className="links">
          {dial.metadata?.link && (
            <>
              <div>
                <ExternalLink href={dial.metadata?.link}>{dial.metadata?.linkTitle ?? 'Learn more'}</ExternalLink>
              </div>
              <div className="recipient">
                {dial && (
                  <Tooltip tip="Recipient address" hideIcon>
                    <Address
                      address={dial.recipient}
                      truncate
                      type="account"
                      chainId={dial.metadata?.network === Networks.Polygon ? ChainIds.MaticMainnet : undefined}
                    />
                  </Tooltip>
                )}
              </div>
              {dial.cap ? <div>Vote weight cap: {dial.cap}%</div> : null}
            </>
          )}
        </div>
        <div className="user-weights">
          <div>
            <div>Show user weights</div>
            <ToggleInput onClick={toggleShowVotesTable} checked={showVotesTable} />
          </div>
        </div>
      </div>
      {children}
    </Container>
  )
}
