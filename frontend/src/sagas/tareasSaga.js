import { call, put, takeLatest, all } from 'redux-saga/effects';
import { tareasApi } from '../api/tareasApi';
import {
  fetchTareasRequest,
  fetchTareasSuccess,
  fetchTareasFailure,
  createTareaRequest,
  createTareaSuccess,
  createTareaFailure,
  updateTareaRequest,
  updateTareaSuccess,
  updateTareaFailure,
  deleteTareaRequest,
  deleteTareaSuccess,
  deleteTareaFailure,
} from '../store/tareasSlice';

// Worker Sagas
function* fetchTareasSaga(action) {
  try {
    const estado = action.payload;
    const response = yield call(tareasApi.obtenerTareas, estado);
    yield put(fetchTareasSuccess(response.data));
  } catch (error) {
    yield put(
      fetchTareasFailure(
        error.response?.data?.detail || 'Error al cargar las tareas'
      )
    );
  }
}

function* createTareaSaga(action) {
  try {
    const response = yield call(tareasApi.crearTarea, action.payload);
    yield put(createTareaSuccess(response.data));
  } catch (error) {
    yield put(
      createTareaFailure(
        error.response?.data?.detail || 'Error al crear la tarea'
      )
    );
  }
}

function* updateTareaSaga(action) {
  try {
    const { id, data } = action.payload;
    const response = yield call(tareasApi.actualizarTarea, id, data);
    yield put(updateTareaSuccess(response.data));
  } catch (error) {
    yield put(
      updateTareaFailure(
        error.response?.data?.detail || 'Error al actualizar la tarea'
      )
    );
  }
}

function* deleteTareaSaga(action) {
  try {
    const id = action.payload;
    yield call(tareasApi.eliminarTarea, id);
    yield put(deleteTareaSuccess(id));
  } catch (error) {
    yield put(
      deleteTareaFailure(
        error.response?.data?.detail || 'Error al eliminar la tarea'
      )
    );
  }
}

// Watcher Sagas
function* watchFetchTareas() {
  yield takeLatest(fetchTareasRequest.type, fetchTareasSaga);
}

function* watchCreateTarea() {
  yield takeLatest(createTareaRequest.type, createTareaSaga);
}

function* watchUpdateTarea() {
  yield takeLatest(updateTareaRequest.type, updateTareaSaga);
}

function* watchDeleteTarea() {
  yield takeLatest(deleteTareaRequest.type, deleteTareaSaga);
}

// Root Saga
export default function* rootSaga() {
  yield all([
    watchFetchTareas(),
    watchCreateTarea(),
    watchUpdateTarea(),
    watchDeleteTarea(),
  ]);
}
