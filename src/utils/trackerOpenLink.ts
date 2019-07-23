import { ApolloLink } from 'apollo-link';
import { Dispatch } from 'redux';
import { ActionType } from '../store/reducers';

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
    if (context.tracked !== undefined) {
      // TODO: STORE IN REDUX
      console.log(name);
      console.log(queryJSON);
      console.log(variablesJSON);
      console.log(contextJSON);
    }
    return forward(operation);
  });
