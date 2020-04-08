import * as types from './types';
import * as utils from './utils';
import { createReducer } from '../../utils';

/* State shape
[
    {
        product,
        quantity,
    }
]
*/

const initialState = [];

const checkoutReducer = createReducer(initialState)({
  [types.ADD_PRODUCTS_TO_CHECKOUT]: (state, action) => {
    const { products } = action.payload;

    if (products.length > 0) {
      const uniqueProductsOfCheckout = products.filter(function(product) {
        return state.indexOf(product) == -1;
      });
      return uniqueProductsOfCheckout;
    } else {
      return [...state];
    }
  },
  [types.REMOVE]: (state, action) => {
    const { product } = action.payload;
    const index = utils.productPositionInCart(state, product);
    return [...state.slice(0, index), ...state.slice(index + 1)];
  },
  [types.CLEAR]: () => [],
});

export default checkoutReducer;
