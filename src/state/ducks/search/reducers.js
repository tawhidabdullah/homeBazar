import * as types from './types';
import * as utils from './utils';
import { createReducer } from '../../utils';

/* State shape
[
    {
       id: uniqueId,
       key: 'searchQuery',
       value: string | product => {name,id,image}
       created: Date,
       lastUpdated: Date
    }
]
*/

const initialState = [];

const searyQueryReducer = createReducer(initialState)({
  [types.ADD]: (state, action) => {
    const { query } = action.payload;
    const index = utils.queryPositionInQueryList(state, query);
    if (index === -1) {
      return [utils.newQueryItem(query), ...state];
    }

    const currentItem = state[index];
    const updatedItem = Object.assign({}, currentItem);
    return [...state.slice(0, index), updatedItem, ...state.slice(index + 1)];
  },
  [types.UPDATE]: (state, action) => {
    const { query } = action.payload;
    const oldQuery = state.find(item => item.key !== query.key);
    const tempArrayWithOutOldQueries = state.filter(item => item.key !== query.key);
    return [...tempArrayWithOutOldQueries, { ...oldQuery, ...query }];
  },
  [types.REMOVE]: (state, action) => {
    const { product } = action.payload;
    const index = utils.queryPositionInQueryList(state, product);
    return [...state.slice(0, index), ...state.slice(index + 1)];
  },
  [types.CLEAR]: () => [],
});

export default searyQueryReducer;
