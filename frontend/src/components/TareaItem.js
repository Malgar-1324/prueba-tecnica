import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTareaRequest, deleteTareaRequest } from '../store/tareasSlice';
import './TareaItem.css';

const TareaItem = ({ tarea }) => {
  const dispatch = useDispatch();
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    titulo: tarea.titulo,
    descripcion: tarea.descripcion,
    estado: tarea.estado,
  });

  const handleMarcarCompletada = () => {
    const nuevoEstado = tarea.estado === 'Completada' ? 'Pendiente' : 'Completada';
    dispatch(
      updateTareaRequest({
        id: tarea.id,
        data: { estado: nuevoEstado },
      })
    );
  };

  const handleEliminar = () => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      dispatch(deleteTareaRequest(tarea.id));
    }
  };

  const handleEditar = () => {
    setEditando(true);
  };

  const handleCancelar = () => {
    setEditando(false);
    setFormData({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      estado: tarea.estado,
    });
  };

  const handleGuardar = () => {
    dispatch(
      updateTareaRequest({
        id: tarea.id,
        data: formData,
      })
    );
    setEditando(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getEstadoClass = (estado) => {
    switch (estado) {
      case 'Completada':
        return 'estado-completada';
      case 'En Progreso':
        return 'estado-progreso';
      default:
        return 'estado-pendiente';
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (editando) {
    return (
      <div className="tarea-item editing">
        <div className="form-group">
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Título"
          />
        </div>
        <div className="form-group">
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Descripción"
            rows={3}
          />
        </div>
        <div className="form-group">
          <select name="estado" value={formData.estado} onChange={handleChange}>
            <option value="Pendiente">Pendiente</option>
            <option value="En Progreso">En Progreso</option>
            <option value="Completada">Completada</option>
          </select>
        </div>
        <div className="tarea-actions">
          <button className="btn-save" onClick={handleGuardar}>
            💾 Guardar
          </button>
          <button className="btn-cancel-edit" onClick={handleCancelar}>
            ✕ Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`tarea-item ${tarea.estado === 'Completada' ? 'completada' : ''}`}>
      <div className="tarea-header">
        <span className={`estado-badge ${getEstadoClass(tarea.estado)}`}>
          {tarea.estado}
        </span>
        <button
          className="btn-check"
          onClick={handleMarcarCompletada}
          title={tarea.estado === 'Completada' ? 'Marcar como pendiente' : 'Marcar como completada'}
        >
          {tarea.estado === 'Completada' ? '✓' : '○'}
        </button>
      </div>

      <h3 className="tarea-titulo">{tarea.titulo}</h3>

      {tarea.descripcion && (
        <p className="tarea-descripcion">{tarea.descripcion}</p>
      )}

      <div className="tarea-footer">
        <small className="tarea-fecha">
          {formatFecha(tarea.fecha_creacion)}
        </small>
        <div className="tarea-actions">
          <button className="btn-edit" onClick={handleEditar} title="Editar">
            ✏️
          </button>
          <button className="btn-delete" onClick={handleEliminar} title="Eliminar">
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default TareaItem;
