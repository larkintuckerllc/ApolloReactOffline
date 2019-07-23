import { combineReducers } from 'redux';
import online, { OnlineActionType, OnlineState } from './online';

export type ActionType = OnlineActionType;
export interface State {
  online: OnlineState;
}
export default combineReducers({
  online,
});
