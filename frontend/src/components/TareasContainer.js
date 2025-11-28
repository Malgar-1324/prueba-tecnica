import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTareasRequest,
  setFiltro,
  clearError,
} from '../store/tareasSlice';
import TareaForm from './TareaForm';
import TareasList from './TareasList';
import './TareasContainer.css';

const TareasContainer = () => {
  const dispatch = useDispatch();
  const { tareas, loading, error, filtro } = useSelector((state) => state.tareas);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    dispatch(fetchTareasRequest(filtro === 'Todas' ? null : filtro));
  }, [dispatch, filtro]);

  const handleFiltroChange = (nuevoFiltro) => {
    dispatch(setFiltro(nuevoFiltro));
  };

  const tareasFiltradas =
    filtro === 'Todas'
      ? tareas
      : tareas.filter((tarea) => tarea.estado === filtro);

  return (
    <div className="tareas-container">
      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button onClick={() => dispatch(clearError())}>✕</button>
        </div>
      )}

      <div className="tareas-header">
        <button
          className="btn-primary"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? '✕ Cancelar' : '+ Nueva Tarea'}
        </button>

        <div className="filtros">
          {['Todas', 'Pendiente', 'En Progreso', 'Completada'].map((f) => (
            <button
              key={f}
              className={`btn-filtro ${filtro === f ? 'active' : ''}`}
              onClick={() => handleFiltroChange(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {mostrarFormulario && (
        <TareaForm onClose={() => setMostrarFormulario(false)} />
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando tareas...</p>
        </div>
      ) : (
        <TareasList tareas={tareasFiltradas} />
      )}
    </div>
  );
};

export default TareasContainer;
