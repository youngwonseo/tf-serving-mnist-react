import {
  createAction,
  createAsyncAction,
  ActionType,
  createReducer
} from 'typesafe-actions';

import createAsyncSaga, {
  createActionTypes
} from '../lib/createAsyncSaga';

import { AxiosError } from 'axios';
import produce from 'immer';
import { takeLatest } from 'redux-saga/effects';
import * as baseAPI from '../lib/api/base';


const [
  PREDICT,
  PREDICT_SUCCESS,
  PREDICT_FAILURE,
] = createActionTypes('base/PREDICT');

export const predict = createAsyncAction(
  PREDICT,
  PREDICT_SUCCESS,
  PREDICT_FAILURE,
)<any, any, AxiosError>();

const predictSaga = createAsyncSaga(PREDICT, baseAPI.predict);

export function* baseSaga() {
  yield takeLatest(PREDICT, predictSaga);
}


export interface BaseState {
  result: any;
  error: any;
};


const initialState: BaseState = {
  result: {
    predictions: [[0,0,0,0,0,0,0,0,0,0]]
  },
  error: '',
}



const base = createReducer<BaseState, any>(initialState, {
  [PREDICT_SUCCESS]: (state, { payload : result}) => ({
    ...state,
    result,
  }),
  [PREDICT_FAILURE]: (state, { payload : error}) => ({
    ...state,
    error,
  }),
});


export default base;