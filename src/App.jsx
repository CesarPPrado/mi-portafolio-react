// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { useContext } from 'react'; // Importar useContext
import { ThemeContext } from './context/ThemeContext.jsx'; // Importar el Contexto
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Proyectos from './pages/Proyectos.jsx'; // Importar página Proyectos
import Contacto from './pages/Contacto.jsx';   // Importar página Contacto
import Register from './pages/Register.jsx';  // Importar páginna Registro
import Login from './pages/Login.jsx'; // Importar páginna Login
import Analytics from './pages/Analytics.jsx'; // Importar página Analytics
import Palettes from './pages/Palettes.jsx'; // Importar nueva página Paletas
import Profile from './pages/Profile.jsx'; // Importar página Perfil
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
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/paletas" element={<Palettes />} />
          <Route path="/perfil" element={<Profile />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;