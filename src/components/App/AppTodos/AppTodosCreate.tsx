import { useMutation } from '@apollo/react-hooks';
import React, { FC, useCallback, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { useSelector } from 'react-redux';
import uuidv4 from 'uuid/v4';
import {
  CREATE_TODO_MUTATION,
  CreateTodoData,
  CreateTodoVariables,
  handleCreateTodoUpdate,
} from '../../../graphql/todos';
import { getOnline } from '../../../store/ducks/online';

// TODO: USE A FORMS LIBRARY INSTEAD; FORMIK
const AppTodosCreate: FC = () => {
  const online = useSelector(getOnline);
  const [title, setTitle] = useState('');
  const [dirty, setDirty] = useState(false);
  const [valid, setvalid] = useState(false);
  const [createTodo, { error, loading }] = useMutation<CreateTodoData, CreateTodoVariables>(
    CREATE_TODO_MUTATION,
    {
      context: {
        serializationKey: 'MUTATION',
        tracked: true,
      },
      update: handleCreateTodoUpdate,
    }
  );
  const handleChangeText = useCallback((text: string) => {
    const isNotBlank = text.trim() !== '';
    setDirty(true);
    setvalid(isNotBlank);
    setTitle(text);
  }, []);
  const handlePress = useCallback(async () => {
    const id = uuidv4();
    if (!online) {
      setTitle('');
      setDirty(false);
      setvalid(false);
    }
    try {
      await createTodo({
        optimisticResponse: {
          createTodo: {
            __typename: 'CreateTodoPayload',
            todo: {
              __typename: 'Todo',
              id,
              nodeId: '',
              title: `${title} (PENDING)`,
            },
          },
        },
        variables: {
          id,
          title,
        },
      });
      if (online) {
        setTitle('');
        setDirty(false);
        setvalid(false);
      }
    } catch (err) {
      //
    }
  }, [online, title]);

  return (
    <View>
      <TextInput editable={!(online && loading)} onChangeText={handleChangeText} value={title} />
      {dirty && !valid && <Text>Required</Text>}
      <Button disabled={!valid || (online && loading)} onPress={handlePress} title="create" />
      {error !== undefined && <Text>error creating</Text>}
    </View>
  );
};

export default AppTodosCreate;
