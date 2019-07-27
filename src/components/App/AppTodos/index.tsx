import { useQuery } from '@apollo/react-hooks';
import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { ALL_TODOS_QUERY, AllTodosData } from '../../../graphql/todos';
import AppTodosCreate from './AppTodosCreate';
import AppTodosTodo from './AppTodosTodo';

const AppTodos: FC = () => {
  const { loading, data, error } = useQuery<AllTodosData>(ALL_TODOS_QUERY);

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
        <Text>Error Cache or Network Query</Text>
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
