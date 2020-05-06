import { useEffect, useReducer } from 'react';
import Connector from '../lib/connector.js';

type TInitialData = any;
type Tdependecies = any[] | [];
type TItem = string;
type IFormat = string | undefined;

type Actions = {
  type: string;
  payload?: any;
};

interface IState {
  readonly isLoading: boolean;
  readonly error: object;
  readonly data: TInitialData;
  readonly done: boolean;
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
        done: false,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        done: true,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: {
          isError: true,
          error: action.payload,
          done: true,
        },
      };
    default:
      throw new Error();
  }
};

const useFetch = (
  dependencies: Tdependecies = [],
  initialData: TInitialData,
  item: TItem,
  options?: any,
  format?: IFormat
): IState => {
  const initialState: IState = {
    isLoading: false,
    error: {
      isError: false,
      error: {},
    },
    data: initialData,
    done: false,
  };
  const [state, dispatch] = useReducer(dataFetchReducer, initialState);

  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });
      try {
        // @ts-ignore
        let data = await connector.request(item, format, options);
        if (!didCancel) {
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: 'FETCH_FAILURE', payload: error });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, dependencies);

  return state;
};

export default useFetch;
