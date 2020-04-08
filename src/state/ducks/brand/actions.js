import * as types from './types';

export const addBrand = (brands) => ({
  type: types.ADD_BRAND,
  payload: {
    brands,
  },
});

export const getBrand = () => ({
  type: types.GET_BRAND,
});
