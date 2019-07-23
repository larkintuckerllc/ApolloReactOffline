import NetInfo from '@react-native-community/netinfo';
import React, { FC, useEffect } from 'react';
import { Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getOnline, setOnline } from '../../../store/reducers/online';
import styles from './styles';

const AppOnline: FC = () => {
  const dispatch = useDispatch();
  const online = useSelector(getOnline);
  useEffect(() => {
    const checkOnline = async () => {
      try {
        const state = await NetInfo.fetch();
        dispatch(setOnline(state.isConnected));
      } catch (err) {
        //
      }
    };
    checkOnline();
    const unsubscribe = NetInfo.addEventListener(state => {
      dispatch(setOnline(state.isConnected));
    });
    return unsubscribe;
  }, []);

  return (
    <View style={styles.root}>
      <Text>{online ? 'ONLINE' : 'OFFLINE'}</Text>
    </View>
  );
};

export default AppOnline;
