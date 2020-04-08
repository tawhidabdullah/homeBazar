import * as types from './types';
import { createReducer } from '../../utils';

const initialState = [];

const cartReducer = createReducer(initialState)({
  [types.ADD_BRAND]: (state, action) => {
    const { brands } = action.payload;

    if (brands) {
      return brands;
    }

    return [...state];
  },

  [types.GET_BRAND]: (state, action) => {
    return [...state];
  },
});

export default cartReducer;
