import * as types from './types';
import { createReducer } from '../../utils';

const initialState = [];

const cartReducer = createReducer(initialState)({
  [types.ADD_TAGS]: (state, action) => {
    const { tags } = action.payload;

    if (tags) {
      return tags;
    }

    return [...state];
  },

  [types.GET_TAGS]: (state, action) => {
    return [...state];
  },
});

export default cartReducer;
