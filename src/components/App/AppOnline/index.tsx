import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { getOnline } from '../../../store/ducks/online';
import styles from './styles';

const AppOnline: FC = () => {
  const online = useSelector(getOnline);

  return (
    <View style={styles.root}>
      <Text>{online ? 'ONLINE' : 'OFFLINE'}</Text>
    </View>
  );
};

export default AppOnline;
