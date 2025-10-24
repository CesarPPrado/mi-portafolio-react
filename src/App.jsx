// src/App.jsx

import Header from './components/Header.jsx'; // 1. Importamos nuestro nuevo componente

function App() {
  return (
    <div>
      <Header /> {/* 2. Usamos el componente como si fuera una etiqueta HTML */}

      {/* Aquí irá el resto de nuestro contenido más adelante */}
      <main>
        <p>Contenido principal de la página.</p>
      </main>
    </div>
  );
}

export default App;