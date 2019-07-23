import React, { FC, useEffect } from 'react';
import { Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getTrackedQueries, trackedQueriesRemove } from '../../store/ducks/trackedQueries';

const AppTrackedQueries: FC = () => {
  const dispatch = useDispatch();
  const trackedQueries = useSelector(getTrackedQueries);
  useEffect(() => {
    trackedQueries.forEach(trackedQuery => {
      // TODO: REGENERATE MUTATIONS
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
