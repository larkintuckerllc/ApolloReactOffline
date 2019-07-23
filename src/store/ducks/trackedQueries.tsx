import { combineReducers } from 'redux';
import { ActionType, State } from '../ducks';

interface TrackedQuery {
  id: string;
}

// ACTIONS
const TRACKED_QUERIES_ADD = 'TRACKED_QUERIES_ADD';

interface TrackedQueriesAdd {
  payload: TrackedQuery;
  type: typeof TRACKED_QUERIES_ADD;
}

export type TrackedQueriesActionType = TrackedQueriesAdd;

// ACTION CREATORS
export const trackedQueriesAdd = (trackedQuery: TrackedQuery): TrackedQueriesAdd => ({
  payload: trackedQuery,
  type: TRACKED_QUERIES_ADD,
});

// REDUCERS
interface TrackedQueriesById {
  [key: string]: TrackedQuery;
}

type TrackedQueriesIds = string[];

export interface TrackedQueriesState {
  byId: TrackedQueriesById;
  ids: TrackedQueriesIds;
}

const byId = (state: TrackedQueriesById = {}, action: ActionType) => {
  switch (action.type) {
    case TRACKED_QUERIES_ADD:
      const newState = {
        ...state,
        [action.payload.id]: action.payload,
      };
      return newState;
    default:
      return state;
  }
};

const ids = (state: TrackedQueriesIds = [], action: ActionType) => {
  switch (action.type) {
    case TRACKED_QUERIES_ADD:
      const newState = [...state, action.payload.id];
      return newState;
    default:
      return state;
  }
};

export default combineReducers({
  byId,
  ids,
});
/*

// SELECTORS
// export const getOnline = (state: State) => state.online;
*/
