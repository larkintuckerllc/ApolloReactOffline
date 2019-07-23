import { combineReducers } from 'redux';
import online, { OnlineActionType, OnlineState } from './online';
import trackedQueries, { TrackedQueriesActionType, TrackedQueriesState } from './trackedQueries';

export type ActionType = OnlineActionType | TrackedQueriesActionType;
export interface State {
  online: OnlineState;
  trackedQueries: TrackedQueriesState;
}

export default combineReducers({
  online,
  trackedQueries,
});
