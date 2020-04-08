import * as types from './types';

export const addItemToCache = (response) => ({
  type: types.ADD_ITEM_TO_CACHE,
  payload: {
    response,
  },
});
