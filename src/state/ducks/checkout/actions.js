import * as types from './types';

export const addProductsToCheckout = products => ({
  type: types.ADD_PRODUCTS_TO_CHECKOUT,
  payload: {
    products,
  },
});

export const removeFromCheckout = product => ({
  type: types.REMOVE,
  payload: {
    product,
  },
});

export const clearCheckout = () => ({
  type: types.CLEAR,
});

export const setCheckout = cart => ({
  type: types.SET_CART,
  payload: {
    cart,
  },
});
