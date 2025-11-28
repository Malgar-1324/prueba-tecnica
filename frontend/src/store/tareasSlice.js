import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tareas: [],
  loading: false,
  error: null,
  filtro: 'Todas',
};

const tareasSlice = createSlice({
  name: 'tareas',
  initialState,
  reducers: {
    // Obtener tareas
    fetchTareasRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTareasSuccess: (state, action) => {
      state.loading = false;
      state.tareas = action.payload;
    },
    fetchTareasFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Crear tarea
    createTareaRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createTareaSuccess: (state, action) => {
      state.loading = false;
      state.tareas.unshift(action.payload);
    },
    createTareaFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Actualizar tarea
    updateTareaRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateTareaSuccess: (state, action) => {
      state.loading = false;
      const index = state.tareas.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tareas[index] = action.payload;
      }
    },
    updateTareaFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Eliminar tarea
    deleteTareaRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteTareaSuccess: (state, action) => {
      state.loading = false;
      state.tareas = state.tareas.filter((t) => t.id !== action.payload);
    },
    deleteTareaFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Cambiar filtro
    setFiltro: (state, action) => {
      state.filtro = action.payload;
    },

    // Limpiar errores
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
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
  setFiltro,
  clearError,
} = tareasSlice.actions;

export default tareasSlice.reducer;
