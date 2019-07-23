import { useMutation } from '@apollo/react-hooks';
import React, { FC, useCallback } from 'react';
import { Button, Text, View } from 'react-native';
import {
  DELETE_TODO_BY_ID_MUTATION,
  DeleteTodoByIdData,
  DeleteTodoByIdVariables,
  handleDeleteTodoUpdate,
} from '../../../graphql/todos';

interface Props {
  id: string;
  title: string;
}

const AppTodosTodo: FC<Props> = ({ id, title }) => {
  const [deleteTodoById, { error, loading }] = useMutation<
    DeleteTodoByIdData,
    DeleteTodoByIdVariables
  >(DELETE_TODO_BY_ID_MUTATION, {
    context: {
      serializationKey: 'MUTATION',
    },
    update: handleDeleteTodoUpdate,
  });
  const handlePress = useCallback(async () => {
    try {
      await deleteTodoById({
        optimisticResponse: {
          deleteTodoById: {
            __typename: 'DeleteTodoPayload',
            todo: {
              __typename: 'Todo',
              id,
            },
          },
        },
        variables: {
          id,
        },
      });
    } catch (err) {
      //
    }
  }, [id]);

  return (
    <View>
      <Text>{title}</Text>
      <Button disabled={loading} onPress={handlePress} title="delete" />
      {error !== undefined && <Text>error deleting</Text>}
    </View>
  );
};

export default AppTodosTodo;
