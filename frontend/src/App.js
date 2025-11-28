import React from 'react';
import './App.css';
import TareasContainer from './components/TareasContainer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>📝 Sistema de Gestión de Tareas</h1>
      </header>
      <main className="App-main">
        <TareasContainer />
      </main>
    </div>
  );
}

export default App;
