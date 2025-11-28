import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const tareasApi = {
  obtenerTareas: (estado = null) => {
    const params = estado && estado !== 'Todas' ? { estado } : {};
    return api.get('/api/tareas', { params });
  },

  obtenerTarea: (id) => {
    return api.get(`/api/tareas/${id}`);
  },

  crearTarea: (tarea) => {
    return api.post('/api/tareas', tarea);
  },

  actualizarTarea: (id, tarea) => {
    return api.put(`/api/tareas/${id}`, tarea);
  },

  eliminarTarea: (id) => {
    return api.delete(`/api/tareas/${id}`);
  },
};

export default api;
