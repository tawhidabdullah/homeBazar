import * as types from './types';
import { createReducer } from '../../utils';

const initialState = [];

const cartReducer = createReducer(initialState)({
  [types.ADD_CATEGORIES]: (state, action) => {
    const { categories } = action.payload;

    if (categories) {
      return categories;
    }

    return [...state];
  },

  [types.GET_CATEGORIES]: (state, action) => {
    return [...state];
  },
});

export default cartReducer;
