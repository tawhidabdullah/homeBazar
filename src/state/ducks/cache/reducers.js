import * as types from './types';
import { createReducer } from '../../utils';

const initialState = {};

const cartReducer = createReducer(initialState)({
  [types.ADD_ITEM_TO_CACHE]: (state, action) => {
    const { response } = action.payload;

    if (response) {
      return { ...state, ...response };
    }

    return { ...state };
  },
});

export default cartReducer;
