import { useReducer } from 'react';
import Connector from '../lib/connector.js';

type TInitialData = any;
type TItem = string;

type Actions = {
  type: string;
  payload?: any;
};

interface IState {
  readonly isLoading: boolean;
  readonly error: object;
  readonly data: TInitialData;
}

const connector = new Connector();

const dataFetchReducer = (state: IState, action: Actions) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        error: {
          isError: false,
          error: {},
        },
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        data: action.payload,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: {
          isError: true,
          error: action.payload,
        },
      };
    default:
      throw new Error();
  }
};

const useHandleFetch = (
  initialData: TInitialData,
  item: TItem
): [IState, (values: any) => void] => {
  const initialState: IState = {
    isLoading: false,
    error: {
      isError: false,
      error: {},
    },
    data: initialData,
  };

  const [state, dispatch] = useReducer(dataFetchReducer, initialState);

  const handlePost = async (options: any) => {
    dispatch({ type: 'FETCH_INIT' });

    try {
      // @ts-ignore
      let data = await connector.request(item, 'json', options);
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
      return data;
    } catch (error) {
      dispatch({ type: 'FETCH_FAILURE', payload: error });
      return initialData;
    }
  };

  return [state, handlePost];
};

export default useHandleFetch;
