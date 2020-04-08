import * as types from './types';

export const addTag = (tags) => ({
  type: types.ADD_TAGS,
  payload: {
    tags,
  },
});

export const getTag = () => ({
  type: types.GET_TAGS,
});
