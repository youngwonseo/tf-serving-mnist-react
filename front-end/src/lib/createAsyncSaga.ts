import { call, put } from 'redux-saga/effects';
import { startLoading, finishLoading } from '../modules/loading';



export const createActionTypes = (type: any) => {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;
  return [type, SUCCESS, FAILURE];
};



export default function createAsyncSaga(type: any, request: any) {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;
  
  return function*(action: any) {
    yield put(startLoading(type)); // 로딩 시작
    try {
      const response = yield call(request, action.payload);
      yield put({
        type: SUCCESS,
        payload: response.data,
        meta: response,
      });
    } catch (e) {
      yield put({
        type: FAILURE,
        payload: e,
        error: true,
      });
    }
    console.log(type, 'finish loading')
    yield put(finishLoading(type)); // 로딩 끝
  };
}