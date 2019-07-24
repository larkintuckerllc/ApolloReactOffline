import { MutationUpdaterFn } from 'apollo-client';
import { handleCreateTodoUpdate, handleDeleteTodoUpdate } from './todos';

interface UpdateHandlerByName {
  [key: string]: MutationUpdaterFn;
}

export const updateHandlerByName: UpdateHandlerByName = {
  createTodo: handleCreateTodoUpdate,
  deleteTodo: handleDeleteTodoUpdate,
};
