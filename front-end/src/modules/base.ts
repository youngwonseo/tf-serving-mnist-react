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
import { takeLatest } from 'redux-saga/effects';
import * as baseAPI from '../lib/api/base';

const INITIALIZE = 'base/INITIALIZE';
export const initialize = createAction(INITIALIZE)();

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
    labels: ['0','1','2','3','4','5','6','7','8','9'],
    datasets: [
      {
        data: [0,0,0,0,0,0,0,0,0,0],
        backgroundColor: '#4c6ef5'
      }
    ]
  },
  error: '',
}


const base = createReducer<BaseState, any>(initialState, {
  [INITIALIZE]: (state) => ({
    ...initialState
  }),
  [PREDICT_SUCCESS]: (state, { payload }) => ({
    ...state,
    result: {
      ...state.result,
      datasets: [
        {
          ...state.result.datasets[0],
          data: payload.predictions[0],
        }
      ]
    }
  }),
  [PREDICT_FAILURE]: (state, { payload : error}) => ({
    ...state,
    error,
  }),
});


export default base;