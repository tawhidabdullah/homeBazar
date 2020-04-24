import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import * as reducers from './ducks';
import { apiService } from './middlewares';

const rootReducer = combineReducers(reducers);

const persistConfig = {
  key: 'shop',
  storage: storage,
  whitelist: ['session'], // which reducer want to store
};

const pReducer = persistReducer(persistConfig, rootReducer);

function configureStore(initialState) {
  return createStore(
    pReducer,
    initialState,
    compose(
      applyMiddleware(apiService),
      window.__REDUX_DEVTOOLS_EXTENSION__
        ? window.__REDUX_DEVTOOLS_EXTENSION__()
        : (f) => f
    )
  );
}

const store = configureStore({});

const persistor = persistStore(store);

export { persistor, store };
