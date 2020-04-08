import * as types from './types';

export const addToCart = (product, quantity) => ({
  type: types.TOGGLE,
  payload: {
    product,
    quantity,
    isSelectedForCheckout: false,
  },
});

export const addProductsToCart = (cartItems) => ({
  type: types.ADD_PRODUCTS_TO_CART,
  payload: {
    cartItems,
  },
});

export const selectProductForCheckout = (product) => ({
  type: types.SELECT_PRODUCT_FOR_CHECKOUT,
  payload: {
    product,
  },
});

export const changeQuantity = (product, quantity) => ({
  type: types.CHANGE_QUANTITY,
  payload: {
    product,
    quantity,
  },
});

export const removeFromCart = (product) => ({
  type: types.REMOVE,
  payload: {
    product,
  },
});

export const clearCart = () => ({
  type: types.CLEAR,
});

export const setCart = (cart) => ({
  type: types.SET_CART,
  payload: {
    cart,
  },
});
