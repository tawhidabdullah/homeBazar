import * as types from './types';

export const addToWishList = product => ({
  type: types.TOGGLE,
  payload: {
    product: {
      ...product,
      isSelectedForCart: false,
    },
  },
});

export const selectProductForCart = product => ({
  type: types.SELECT_PRODUCT_FOR_CART,
  payload: {
    product: {
      ...product,
    },
  },
});

export const removeFromWishList = product => ({
  type: types.REMOVE,
  payload: {
    product,
  },
});

export const clearWishList = () => ({
  type: types.CLEAR,
});
