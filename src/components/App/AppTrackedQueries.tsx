import { useApolloClient } from '@apollo/react-hooks';
import React, { FC, useEffect } from 'react';
import { Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getTrackedQueries, trackedQueriesRemove } from '../../store/ducks/trackedQueries';

const AppTrackedQueries: FC = () => {
  const client = useApolloClient();
  const dispatch = useDispatch();
  const trackedQueries = useSelector(getTrackedQueries);
  useEffect(() => {
    trackedQueries.forEach(trackedQuery => {
      const context = JSON.parse(trackedQuery.contextJSON);
      const query = JSON.parse(trackedQuery.queryJSON);
      const variables = JSON.parse(trackedQuery.variablesJSON);
      // TODO: CHANGE TO MUTATION
      client.mutate({
        context,
        mutation: query,
        variables,
      });
      dispatch(trackedQueriesRemove(trackedQuery.id));
    });
  }, []);

  return (
    <View>
      <Text>Tracked Queries</Text>
      {trackedQueries.map(trackedQuery => (
        <Text key={trackedQuery.id}>{trackedQuery.id}</Text>
      ))}
    </View>
  );
};

export default AppTrackedQueries;
