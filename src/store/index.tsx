import { createStore } from 'redux';
import reducer from './ducks/';

interface MyWindow extends Window {
  __REDUX_DEVTOOLS_EXTENSION__?: any;
}

export default createStore(
  reducer,
  (window as MyWindow).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as MyWindow).__REDUX_DEVTOOLS_EXTENSION__()
);
