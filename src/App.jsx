// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Proyectos from './pages/Proyectos.jsx'; // 1. Importar página Proyectos
import Contacto from './pages/Contacto.jsx';   // 2. Importar página Contacto

function App() {
  return (
    <div>
      <Header />
      <main>
        <Routes>
          {/* 3. Añadir las nuevas rutas */}
          <Route path="/" element={<Home />} />
          <Route path="/proyectos" element={<Proyectos />} />
          <Route path="/contacto" element={<Contacto />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;