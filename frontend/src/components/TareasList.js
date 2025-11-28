import React from 'react';
import TareaItem from './TareaItem';
import './TareasList.css';

const TareasList = ({ tareas }) => {
  if (tareas.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <h3>No hay tareas</h3>
        <p>Crea una nueva tarea para comenzar</p>
      </div>
    );
  }

  return (
    <div className="tareas-list">
      <div className="tareas-grid">
        {tareas.map((tarea) => (
          <TareaItem key={tarea.id} tarea={tarea} />
        ))}
      </div>
    </div>
  );
};

export default TareasList;
