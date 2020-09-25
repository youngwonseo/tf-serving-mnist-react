import {
  createAction,
  ActionType, 
  createReducer
} from 'typesafe-actions';


const START_LOADING = 'loading/START_LOADING';
const FINISH_LOADING = 'loading/FINISH_LOADING';


export const startLoading = createAction(
  START_LOADING,
  (requestType: any) => requestType
)();


export const finishLoading = createAction(
  FINISH_LOADING,
  (requestType: any) => requestType
)();

const initialState = {};


const loading = createReducer(initialState, {
  [START_LOADING]: (state: any, action: any) => ({
    ...state,
    [action.payload]: true
  }),
  [FINISH_LOADING]: (state: any, action: any) => ({
    ...state,
    [action.payload]: false
  })
});


export default loading;