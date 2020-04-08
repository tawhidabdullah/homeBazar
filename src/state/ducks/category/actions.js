import * as types from './types';

export const addCategory = (categories) => ({
  type: types.ADD_CATEGORIES,
  payload: {
    categories,
  },
});

export const getCategory = () => ({
  type: types.GET_CATEGORIES,
});
