import * as types from './types';

export const addToQueryList = query => ({
  type: types.ADD,
  payload: {
    query,
  },
});

export const updateQueryToQueryList = query => ({
  type: types.UPDATE,
  payload: {
    query,
  },
});

export const removeQueryList = query => ({
  type: types.REMOVE,
  payload: {
    query,
  },
});

export const clearQueryList = () => ({
  type: types.CLEAR,
});
