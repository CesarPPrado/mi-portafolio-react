// src/components/Header.jsx
import { Link, useNavigate } from 'react-router-dom'; // 1. Importar 'useNavigate'
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext.jsx';
import { useAuth } from '../context/AuthContext.jsx'; // 2. Importar 'useAuth'
import styles from './Header.module.css';

function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  // 3. Obtener el estado de login y la función de logout
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  // 4. Crear una función para manejar el logout
  const handleLogout = () => {
    logout(); // Borra el token
    navigate('/'); // Redirige a la página de inicio
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logoLink}>Mi Portafolio Personal</Link>
      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/proyectos">Proyectos</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>

          {/* 5. Lógica Condicional: */}
          {!isLoggedIn ? (
            // 6. Si NO está logueado, mostrar Login y Register
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          ) : (
            // 7. Si SÍ está logueado, mostrar botón de Logout
            <li>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </li>
          )}

          {/* Botón de Tema (ya lo teníamos) */}
          <li>
            <button onClick={toggleTheme} className={styles.themeToggle}>
              {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;