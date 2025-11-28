import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import tareasReducer from './tareasSlice';
import rootSaga from '../sagas/tareasSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    tareas: tareasReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;
