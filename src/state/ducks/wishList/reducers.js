import * as types from './types';
import * as utils from './utils';
import { createReducer } from '../../utils';

/* State shape
[
    {
        product
    }
]
*/

const initialState = [];

const wishListReducer = createReducer(initialState)({
  [types.TOGGLE]: (state, action) => {
    const { productId } = action.payload;

    const index = utils.productPositionInWishList(state, productId);
    if (index === -1) {
      return [...state, productId];
    }

    const tempArrayWithOutOldProduct = state.filter(
      (item) => item !== productId
    );

    return tempArrayWithOutOldProduct;
  },
  [types.ADD_WISHLIST]: (state, action) => {
    const wishlist = action.payload;
    return [...wishlist];
  },

  [types.REMOVE]: (state, action) => {
    const { productId } = action.payload;
    const index = utils.productPositionInWishList(state, productId);
    return [...state.slice(0, index), ...state.slice(index + 1)];
  },
  [types.CLEAR]: () => [],
});

export default wishListReducer;
