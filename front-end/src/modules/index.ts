import { combineReducers  } from 'redux';
import { all } from 'redux-saga/effects';
import base, { baseSaga } from './base';

import loading from './loading';


const rootReducer = combineReducers({
  loading,
  base,
});

export function* rootSaga() {
  yield all([
    baseSaga(),
  ]);
};

export default rootReducer;


export type RootState = ReturnType<typeof rootReducer>;