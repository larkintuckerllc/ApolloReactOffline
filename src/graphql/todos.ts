import { MutationUpdaterFn } from 'apollo-client';
import gql from 'graphql-tag';

export const ALL_TODOS_QUERY = gql`
  {
    allTodos {
      nodes {
        id
        nodeId
        title
      }
    }
  }
`;

export const CREATE_TODO_MUTATION = gql`
  mutation createTodo($id: String!, $title: String!) {
    createTodo(input: { todo: { id: $id, title: $title } }) {
      todo {
        id
        nodeId
        title
      }
    }
  }
`;

export const DELETE_TODO_BY_ID_MUTATION = gql`
  mutation deleteTodoById($id: String!) {
    deleteTodoById(input: { id: $id }) {
      todo {
        id
      }
    }
  }
`;

export interface Todo {
  __typename: 'Todo';
  id: string;
  nodeId: string;
  title: string;
}

export interface TodoId {
  __typename: 'Todo';
  id: string;
}

export interface AllTodosData {
  allTodos: {
    nodes: Todo[];
  };
}

export interface CreateTodoData {
  createTodo: {
    __typename: 'CreateTodoPayload';
    todo: Todo;
  };
}

export interface CreateTodoVariables {
  id: string;
  title: string;
}

// TODO: REPORT BUG ON TYPING OF DATA
export const handleCreateTodoUpdate: MutationUpdaterFn<CreateTodoData> = (cache, { data }) => {
  if (data === undefined) {
    return;
  }
  const {
    createTodo: { todo },
  } = data;
  const cacheData = cache.readQuery<AllTodosData>({ query: ALL_TODOS_QUERY });
  if (cacheData === null) {
    return;
  }
  const { allTodos } = cacheData;
  const { nodes: todos } = allTodos;
  const newAllTodos = { ...allTodos };
  newAllTodos.nodes = [...todos, todo];
  cache.writeQuery({
    data: { allTodos: newAllTodos },
    query: ALL_TODOS_QUERY,
  });
};

export interface DeleteTodoByIdData {
  deleteTodoById: {
    __typename: 'DeleteTodoPayload';
    todo: TodoId;
  };
}

export interface DeleteTodoByIdVariables {
  id: string;
}

// TODO: REPORT BUG ON TYPING OF DATA
export const handleDeleteTodoUpdate: MutationUpdaterFn<DeleteTodoByIdData> = (cache, { data }) => {
  if (data === undefined) {
    return;
  }
  const {
    deleteTodoById: {
      todo: { id },
    },
  } = data;
  const cacheData = cache.readQuery<AllTodosData>({ query: ALL_TODOS_QUERY });
  if (cacheData === null) {
    return;
  }
  const { allTodos } = cacheData;
  const { nodes: todos } = allTodos;
  const filteredTodos = todos.filter((todo: any) => todo.id !== id);
  const newAllTodos = { ...allTodos };
  newAllTodos.nodes = filteredTodos;
  cache.writeQuery({
    data: { allTodos: newAllTodos },
    query: ALL_TODOS_QUERY,
  });
};
