import {configureStore} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { reducers } from '../redux/reducers';
import rootSaga from '../redux/sagas';


const sagaMiddleware = createSagaMiddleware();

/* create a middleware with default middleware and saga middleware */
const middleware = [sagaMiddleware];

const store = configureStore({
  reducer: reducers,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(middleware),
});

/* run the saga middleware with root saga */
sagaMiddleware.run(rootSaga);

export {store};
