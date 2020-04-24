import * as types from './types';

export const addToWishList = productId => ({
  type: types.TOGGLE,
  payload: {
    productId,
  },
});

export const addWishlist = wishlist => {
  return {
    type: types.ADD_WISHLIST,
    payload: wishlist,
  };
};

export const removeFromWishList = productId => ({
  type: types.REMOVE,
  payload: {
    productId,
  },
});

export const clearWishList = () => ({
  type: types.CLEAR,
});
