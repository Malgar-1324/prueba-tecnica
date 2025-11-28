import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTareaRequest } from '../store/tareasSlice';
import './TareaForm.css';

const TareaForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    estado: 'Pendiente',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.titulo.trim()) {
      dispatch(createTareaRequest(formData));
      setFormData({
        titulo: '',
        descripcion: '',
        estado: 'Pendiente',
      });
      onClose();
    }
  };

  return (
    <div className="tarea-form-container">
      <form onSubmit={handleSubmit} className="tarea-form">
        <h2>Nueva Tarea</h2>

        <div className="form-group">
          <label htmlFor="titulo">Título *</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Ingresa el título de la tarea"
            required
            maxLength={200}
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Describe la tarea (opcional)"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En Progreso">En Progreso</option>
            <option value="Completada">Completada</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Crear Tarea
          </button>
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default TareaForm;
