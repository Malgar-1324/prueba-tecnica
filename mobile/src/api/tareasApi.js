import axios from 'axios';

// Cambiar esta URL por la IP de tu máquina cuando pruebes en dispositivo físico
// Ejemplo: http://192.168.1.100:8000
const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const tareasApi = {
  obtenerTareas: async (estado = null) => {
    try {
      const params = estado && estado !== 'Todas' ? { estado } : {};
      const response = await api.get('/api/tareas', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  obtenerTarea: async (id) => {
    try {
      const response = await api.get(`/api/tareas/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  crearTarea: async (tarea) => {
    try {
      const response = await api.post('/api/tareas', tarea);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  actualizarTarea: async (id, tarea) => {
    try {
      const response = await api.put(`/api/tareas/${id}`, tarea);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  eliminarTarea: async (id) => {
    try {
      await api.delete(`/api/tareas/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  },
};

export default api;
