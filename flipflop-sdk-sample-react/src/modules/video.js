import { createAction, handleActions } from 'redux-actions';

const SET_SDK = 'video/SET_SDK'
const SET_PLAYER = 'video/SET_PLAYER'

export const actions = {
  setSdk: createAction(SET_SDK),
  setPlayer: createAction(SET_PLAYER)
}

const initialState = {
  sdk: null,
  player: null,
}

export default handleActions({
  [SET_SDK]: (state, action) => ({ sdk: action.payload, player: state.player }),
  [SET_PLAYER]: (state, action) => ({ sdk: state.sdk, player: action.payload })
}, initialState)
