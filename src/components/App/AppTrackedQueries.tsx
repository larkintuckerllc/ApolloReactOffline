import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { getTrackedQueries } from '../../store/ducks/trackedQueries';

const AppTrackedQueries: FC = () => {
  const trackedQueries = useSelector(getTrackedQueries);

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
