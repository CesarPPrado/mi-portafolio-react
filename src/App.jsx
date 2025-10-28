// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { useContext } from 'react'; // Importar useContext
import { ThemeContext } from './context/ThemeContext.jsx'; // Importar el Contexto
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Proyectos from './pages/Proyectos.jsx'; // Importar página Proyectos
import Contacto from './pages/Contacto.jsx';   // Importar página Contacto
import styles from './App.module.css'; // IMPORTAR EL NUEVO CSS MODULE

function App() {
  // Consumir el estado del tema
  const { theme } = useContext(ThemeContext);

// 2. COMBINAR la clase del wrapper Y la clase del tema
  return (
    <div className={`${styles.appWrapper} ${theme}`}>
      <Header />
      {/* 3. APLICAR la clase al <main> */}
      <main className={styles.mainContent}>
        <Routes>
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