import { ApolloLink } from 'apollo-link';
import { Dispatch } from 'redux';
import uuidv4 from 'uuid/v4';
import { ActionType } from '../store/ducks';
import { trackedQueriesAdd, trackedQueriesRemove } from '../store/ducks/trackedQueries';

export default (dispatch: Dispatch<ActionType>) =>
  new ApolloLink((operation, forward) => {
    if (forward === undefined) {
      return null;
    }
    const name: string = operation.operationName;
    const queryJSON: string = JSON.stringify(operation.query);
    const variablesJSON: string = JSON.stringify(operation.variables);
    const context = operation.getContext();
    const contextJSON = JSON.stringify(context);
    const id = uuidv4();
    if (context.tracked !== undefined) {
      dispatch(
        trackedQueriesAdd({
          contextJSON,
          id,
          name,
          queryJSON,
          variablesJSON,
        })
      );
    }
    return forward(operation).map(data => {
      if (context.tracked !== undefined) {
        dispatch(trackedQueriesRemove(id));
      }
      return data;
    });
  });
