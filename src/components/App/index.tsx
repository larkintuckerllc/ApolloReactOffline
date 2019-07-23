import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import loggerLink from 'apollo-link-logger';
import QueueLink from 'apollo-link-queue';
import { RetryLink } from 'apollo-link-retry';
import SerializingLink from 'apollo-link-serialize';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import store from '../../store';
import { getOnline } from '../../store/reducers/online';
import trackerOpenLink from '../../utils/trackerOpenLink';
import AppOnline from './AppOnline';
import AppTodos from './AppTodos';

const cache = new InMemoryCache();
const errorLink = onError(() => {
  //
});
const httpLink = new HttpLink({
  uri: 'http://localhost:5000/graphql',
});
const queueLink = new QueueLink();
const retryLink = new RetryLink();
const serializingLink = new SerializingLink();
const client = new ApolloClient({
  cache,
  link: ApolloLink.from([
    loggerLink, // TODO: TEMP
    errorLink, // TODO: TEMP
    trackerOpenLink(store.dispatch),
    queueLink,
    serializingLink,
    retryLink,
    httpLink,
  ]),
});

const AppWithApollo: FC = () => {
  const online = useSelector(getOnline);
  if (online) {
    queueLink.open();
  } else {
    queueLink.close();
  }

  return (
    <ApolloProvider client={client}>
      <AppOnline />
      <AppTodos />
    </ApolloProvider>
  );
};

const AppWithApolloWithRedux: FC = () => (
  <Provider store={store}>
    <AppWithApollo />
  </Provider>
);

export default AppWithApolloWithRedux;
