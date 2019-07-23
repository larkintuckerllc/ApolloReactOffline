import { combineReducers } from 'redux';
import { ActionType, State } from '../ducks';

interface TrackedQuery {
  id: string;
}

// ACTIONS
const TRACKED_QUERIES_ADD = 'TRACKED_QUERIES_ADD';
const TRACKED_QUERIES_REMOVE = 'TRACKED_QUERIES_REMOVE';

interface TrackedQueriesAdd {
  payload: TrackedQuery;
  type: typeof TRACKED_QUERIES_ADD;
}

interface TrackedQueriesRemove {
  payload: string;
  type: typeof TRACKED_QUERIES_REMOVE;
}

export type TrackedQueriesActionType = TrackedQueriesAdd | TrackedQueriesRemove;

// ACTION CREATORS
export const trackedQueriesAdd = (trackedQuery: TrackedQuery): TrackedQueriesAdd => ({
  payload: trackedQuery,
  type: TRACKED_QUERIES_ADD,
});

export const trackedQueriesRemove = (id: string): TrackedQueriesRemove => ({
  payload: id,
  type: TRACKED_QUERIES_REMOVE,
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
  let newState: TrackedQueriesById;
  switch (action.type) {
    case TRACKED_QUERIES_ADD:
      newState = {
        ...state,
        [action.payload.id]: action.payload,
      };
      return newState;
    case TRACKED_QUERIES_REMOVE:
      newState = {
        ...state,
      };
      delete newState[action.payload];
      return newState;
    default:
      return state;
  }
};

const ids = (state: TrackedQueriesIds = [], action: ActionType) => {
  let newState: TrackedQueriesIds;
  switch (action.type) {
    case TRACKED_QUERIES_ADD:
      newState = [...state, action.payload.id];
      return newState;
    case TRACKED_QUERIES_REMOVE:
      newState = state.filter(id => id !== action.payload);
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
