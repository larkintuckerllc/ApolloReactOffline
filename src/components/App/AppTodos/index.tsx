import { useQuery } from '@apollo/react-hooks';
import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { ALL_TODOS_QUERY, AllTodosData } from '../../../graphql/todos';
import { getOnline } from '../../../store/ducks/online';
import AppTodosCreate from './AppTodosCreate';
import AppTodosTodo from './AppTodosTodo';

const AppTodos: FC = () => {
  const online = useSelector(getOnline);
  const fetchPolicy = online ? 'network-only' : 'cache-only';
  const { loading, data, error } = useQuery<AllTodosData>(ALL_TODOS_QUERY, {
    fetchPolicy,
  });

  if (loading) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }
  if (error || data === undefined) {
    return (
      <View>
        <Text>Error</Text>
      </View>
    );
  }
  const {
    allTodos: { nodes: todos },
  } = data;
  return (
    <View>
      <AppTodosCreate />
      {todos.map(({ id, title }) => (
        <AppTodosTodo key={id} id={id} title={title} />
      ))}
    </View>
  );
};

export default AppTodos;
