import { ApolloProvider, useApolloClient } from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
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
import React, { FC, Fragment, useEffect, useState } from 'react';
import { Text } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { PersistGate } from 'redux-persist/integration/react';
import { updateHandlerByName } from '../../graphql';
import store, { persistor } from '../../store';
import { ActionType } from '../../store/ducks/';
import { getOnline, setOnline } from '../../store/ducks/online';
import { getTrackedQueries, trackedQueriesRemove } from '../../store/ducks/trackedQueries';
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

const AppUsingReduxUsingApollo: FC = () => {
  const apolloClient = useApolloClient();
  const dispatch = useDispatch();
  const online = useSelector(getOnline);
  const trackedQueries = useSelector(getTrackedQueries);
  const [trackedLoaded, setTrackedLoaded] = useState(false);
  // TRACKED QUERIES
  useEffect(() => {
    const execute = async () => {
      const promises: Array<Promise<any>> = [];
      trackedQueries.forEach(trackedQuery => {
        const context = JSON.parse(trackedQuery.contextJSON);
        const query = JSON.parse(trackedQuery.queryJSON);
        const variables = JSON.parse(trackedQuery.variablesJSON);
        promises.push(
          apolloClient.mutate({
            context,
            mutation: query,
            optimisticResponse: context.optimisticResponse,
            update: updateHandlerByName[trackedQuery.name],
            variables,
          })
        );
        dispatch(trackedQueriesRemove(trackedQuery.id));
      });
      if (online) {
        try {
          await Promise.all(promises);
        } catch (e) {
          //
        }
      }
      setTrackedLoaded(true);
    };
    execute();
  }, []);

  if (!trackedLoaded) {
    return <Text>Loading Tracked Queries</Text>;
  }
  return (
    <Fragment>
      <AppOnline />
      <AppTodos />
      <AppTrackedQueries />
    </Fragment>
  );
};

const AppUsingRedux: FC = () => {
  const dispatch = useDispatch<Dispatch<ActionType>>();
  const online = useSelector(getOnline);
  const [onlineChecked, setOnlineChecked] = useState(false);
  const [cachePersisted, setCachePersisted] = useState(false);
  // OFFLINE
  useEffect(() => {
    const execute = async () => {
      try {
        const state = await NetInfo.fetch();
        dispatch(setOnline(state.isConnected));
        setOnlineChecked(true);
      } catch (err) {
        //
      }
    };
    execute();
    const unsubscribe = NetInfo.addEventListener(state => {
      dispatch(setOnline(state.isConnected));
    });
    return unsubscribe;
  }, []);
  // APOLLO CLIENT PERSIST
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
  // APOLLO CLIENT QUEUE
  useEffect(() => {
    if (online) {
      queueLink.open();
    } else {
      queueLink.close();
    }
  }, [online]);

  if (!cachePersisted || !onlineChecked) {
    return <Text>Loading Apollo Client Persistence or Online</Text>;
  }
  return (
    <ApolloProvider client={client}>
      <AppUsingReduxUsingApollo />
    </ApolloProvider>
  );
};

const App: FC = () => (
  <Provider store={store}>
    <PersistGate loading={<Text>Loading Redux Persistence</Text>} persistor={persistor}>
      <AppUsingRedux />
    </PersistGate>
  </Provider>
);

export default App;
