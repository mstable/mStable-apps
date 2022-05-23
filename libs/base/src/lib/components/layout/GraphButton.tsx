import { useRef } from 'react'

import { UnstyledButton } from '@apps/dumb-components'
import { ReactComponent as GraphQLIcon } from '@apps/icons/graphql.svg'
import { useToggle } from 'react-use'
import styled from 'styled-components'

import { useNetworkStatus } from '../../context/ApolloProvider'

import type { NetworkStatus, OperationError } from '@jameslefrere/react-apollo-network-status'
import type { FC } from 'react'

const Container = styled.div<{ open: boolean; pending: boolean; error: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  user-select: none;

  button {
    position: relative;
    top: 1px;
    border-radius: 50%;
    padding: 4px;
    width: 28px;
    height: 28px;
    background: ${({ theme, open }) => theme.color.background[open ? 2 : 1]};
    &:hover {
      background: ${({ theme }) => theme.color.background[2]};
    }
    svg {
      width: 20px;
      height: 20px;
    }
  }

  .badge {
    transition: background-color 0.2s;
    background-color: ${({ error, theme, pending }) => (error ? theme.color.red : pending ? 'rgba(0, 92, 222, 0.7)' : 'transparent')};
    position: absolute;
    top: -2px;
    right: -2px;
    border-radius: 50%;
    width: 10px;
    height: 10px;
  }

  > .items {
    display: ${({ open }) => (open ? 'block' : 'none')};
    position: absolute;
    top: 2.5rem;
    right: 0;
    background: ${({ theme }) => theme.color.background[1]};
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.7rem;
    width: 15rem;
    > :not(:last-child) {
      padding: 0.25rem 0;
      border-bottom: 1px ${({ theme }) => theme.color.bodyTransparenter} solid;
    }
  }
`

const EndpointStatusContainer = styled.div`
  display: flex;
  flex-direction: column;

  .name {
    font-weight: bold;
    text-transform: capitalize;
  }

  .error {
    color: ${({ theme }) => theme.redTransparent};
  }

  .pending {
    display: flex;
    flex-wrap: wrap;
    gap: 0 0.5rem;
  }
`

const formatOperationError = (error: OperationError) =>
  error.networkError?.message ?? error.graphQLErrors?.map(error => error.message).join(', ')

const EndpointStatus: FC<{ endpointName: string; status: NetworkStatus }> = ({
  endpointName,
  status: { pendingQueries, pendingMutations, queryError, mutationError },
}) => {
  return (
    <EndpointStatusContainer>
      <div className="name">{endpointName}</div>
      {queryError && <div className="error">{formatOperationError(queryError)}</div>}
      {mutationError && <div className="error">{formatOperationError(mutationError)}</div>}
      <div className="pending">
        {Object.entries({ ...pendingQueries, ...pendingMutations })
          .filter(op => op[1])
          .map(([operationName]) => (
            <div key={operationName}>{operationName}</div>
          ))}
      </div>
    </EndpointStatusContainer>
  )
}

export const GraphButton: FC = () => {
  const container = useRef(null)
  const networkStatus = useNetworkStatus()
  const [show, toggleShow] = useToggle(false)

  const items = Object.entries(networkStatus).filter(
    ([, status]) => status.numPendingQueries || status.numPendingMutations || status.queryError || status.mutationError,
  )

  return (
    <Container
      ref={container}
      open={show}
      pending={Object.values(networkStatus).some(status => status.numPendingQueries || status.numPendingMutations)}
      error={Object.values(networkStatus).some(status => status.queryError || status.mutationError)}
    >
      <UnstyledButton onClick={toggleShow}>
        <GraphQLIcon />
        <div className="badge" />
      </UnstyledButton>
      <div className="items">
        {items.length
          ? items.map(([endpointName, status]) => <EndpointStatus endpointName={endpointName} status={status} key={endpointName} />)
          : 'No active queries'}
      </div>
    </Container>
  )
}
