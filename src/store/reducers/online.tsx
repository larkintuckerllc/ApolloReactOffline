import { ActionType, State } from '../reducers';

// ACTIONS
const SET_ONLINE = 'SET_ONLINE';

interface SetOnlineAction {
  payload: boolean;
  type: typeof SET_ONLINE;
}

export type OnlineActionType = SetOnlineAction;

// ACTION CREATORS
export const setOnline = (state: boolean): SetOnlineAction => ({
  payload: state,
  type: SET_ONLINE,
});

// REDUCERS
export type OnlineState = boolean;

// TODO: SYNC CHECK
const reducer = (state: OnlineState = false, action: ActionType) => {
  switch (action.type) {
    case SET_ONLINE:
      return action.payload;
    default:
      return state;
  }
};

export default reducer;

// SELECTORS
export const getOnline = (state: State) => state.online;
