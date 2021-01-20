import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/link-ws'
import { CATALOGUE_API_GQL_ADDRESS, CATALOGUE_API_GQL_SUBSCRIPTIONS_ADDRESS } from '../../config'

export default ({ children }) => (
  <ApolloProvider
    client={
      new ApolloClient({
        cache: new InMemoryCache(),
        link: split(
          ({ query }) => {
            const definition = getMainDefinition(query)
            return (
              definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
            )
          },
          new WebSocketLink({
            uri: CATALOGUE_API_GQL_SUBSCRIPTIONS_ADDRESS,
            options: {
              reconnect: true,
            },
          }),
          new HttpLink({
            uri: CATALOGUE_API_GQL_ADDRESS,
            credentials: 'include',
          })
        ),
      })
    }
  >
    {children}
  </ApolloProvider>
)