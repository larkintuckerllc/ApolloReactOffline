import { ApolloProvider } from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import { PersistedData, PersistentStorage } from 'apollo-cache-persist/types';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import loggerLink from 'apollo-link-logger';
import QueueLink from 'apollo-link-queue';
import { RetryLink } from 'apollo-link-retry';
import SerializingLink from 'apollo-link-serialize';
import React, { FC, useEffect, useState } from 'react';
import { Text } from 'react-native';
import { useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from '../../store';
import { getOnline } from '../../store/ducks/online';
import trackerLink from '../../utils/trackerLink';
import AppOnline from './AppOnline';
import AppTodos from './AppTodos';
import AppTrackedQueries from './AppTrackedQueries';

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
    trackerLink(store.dispatch),
    queueLink,
    serializingLink,
    retryLink,
    httpLink,
  ]),
});

const AppWithApollo: FC = () => {
  const [cachePersisted, setCachePersisted] = useState(false);
  const online = useSelector(getOnline);
  if (online) {
    queueLink.open();
  } else {
    queueLink.close();
  }
  useEffect(() => {
    const execute = async () => {
      await persistCache({
        cache,
        storage: AsyncStorage as PersistentStorage<PersistedData<NormalizedCacheObject>>,
      });
      setCachePersisted(true);
    };
    execute();
  }, []);

  if (!cachePersisted) {
    return <Text>Loading Apollo Client Persistence</Text>;
  }
  return (
    <ApolloProvider client={client}>
      <AppOnline />
      <AppTodos />
      <AppTrackedQueries />
    </ApolloProvider>
  );
};

const AppWithApolloWithRedux: FC = () => (
  <Provider store={store}>
    <PersistGate loading={<Text>Loading Redux Persistence</Text>} persistor={persistor}>
      <AppWithApollo />
    </PersistGate>
  </Provider>
);

export default AppWithApolloWithRedux;
