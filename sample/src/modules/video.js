import { createAction, handleActions } from 'redux-actions';

const SET_SDK = 'video/SET_SDK'

export const actions = {
  setSdk: createAction(SET_SDK)
}

const initialState = {
  sdk: null
}

export default handleActions({
  [SET_SDK]: (state, action) => ({ sdk: action.payload })
}, initialState)
