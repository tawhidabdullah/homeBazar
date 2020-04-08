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
    const { product } = action.payload;

    const index = utils.productPositionInWishList(state, product);
    if (index === -1) {
      return [...state, product];
    }

    const tempArrayWithOutOldProduct = state.filter(item => item.id !== product.id);

    return tempArrayWithOutOldProduct;
  },

  [types.SELECT_PRODUCT_FOR_CART]: (state, action) => {
    const { product } = action.payload;
    const index = utils.productPositionInWishList(state, product);
    if (index === -1) {
      return [...state, { ...product, isSelectedForCart: true }];
    } else if (index !== -1 && !product.isSelectedForCart) {
      const tempArrayWithOutOldProduct = state.filter(item => item.id !== product.id);

      return [...tempArrayWithOutOldProduct, { ...product, isSelectedForCart: true }];
    }

    const tempArrayWithOutOldProduct = state.filter(item => item.id !== product.id);

    return [...tempArrayWithOutOldProduct, { ...product, isSelectedForCart: false }];
  },

  [types.REMOVE]: (state, action) => {
    const { product } = action.payload;
    const index = utils.productPositionInWishList(state, product);
    return [...state.slice(0, index), ...state.slice(index + 1)];
  },
  [types.CLEAR]: () => [],
});

export default wishListReducer;
