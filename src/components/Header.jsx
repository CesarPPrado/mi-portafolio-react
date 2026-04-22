// src/components/Header.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Activity } from 'lucide-react';
import styles from './Header.module.css';

function Header() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAnalytics = location.pathname === '/analytics';

  const handleLogout = () => {
    logout(); // Borra el token
    navigate('/'); // Redirige a la página de inicio
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        {/* Logo Container con el Hover Panel */}
        <div className={styles.logoContainer}>
          {isAnalytics ? (
            <div className={styles.brandTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '1.25rem', fontWeight: 600 }}>
              <Activity color="var(--accent-color, #00C6FF)" size={24} />
              <span>ANALYTICS CORE</span>
            </div>
          ) : (
            <div className={styles.logoIcon}>
              <span className={styles.epicShield}>◆</span>
            </div>
          )}
          {/* El Mega Menú / Panel Desplegable */}
          <div className={styles.megaMenu}>
            <div className={styles.megaMenuColumns}>
              <div className={styles.megaMenuColumn}>
                <h3>Mis Proyectos</h3>
                <Link to="/proyectos">Juego principal</Link>
                <Link to="/proyectos">Portafolio</Link>
                <Link to="/analytics">Dashboard</Link>
                <Link to="/paletas">Paletas</Link>
              </div>
              <div className={styles.megaMenuColumn}>
                <h3>Habilidades</h3>
                <a href="#">React</a>
                <a href="#">JavaScript</a>
                <a href="#">CSS / HTML</a>
              </div>
              <div className={styles.megaMenuColumn}>
                <h3>Conecta</h3>
                <Link to="/contacto">Contáctame</Link>
                <a href="#">LinkedIn</a>
                <a href="#">GitHub</a>
              </div>
            </div>
          </div>
        </div>

        {/* Navegación Principal */}
        <nav className={styles.mainNav}>
          <Link to="/">INICIO</Link>
          <Link to="/proyectos">PROYECTOS</Link>
          <Link to="/analytics">DASHBOARD</Link>
          <Link to="/paletas">PALETAS</Link>
          <Link to="/contacto">CONTACTO</Link>
        </nav>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.authLinks}>
          {!isLoggedIn ? (
            <>
              <Link to="/login" className={styles.iconLink}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
                Acceso
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className={styles.logoutButton}>
              Salir
            </button>
          )}
        </div>

        {/* Botón azul "Descargar" */}
        <a href="https://play.google.com" target="_blank" rel="noreferrer" className={styles.downloadButton}>
          Descargar Juego
        </a>
      </div>
    </header>
  );
}

export default Header;