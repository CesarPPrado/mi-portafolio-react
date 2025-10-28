// src/components/Header.jsx
import { Link } from 'react-router-dom'; // Importar 'Link'
import { useContext } from 'react'; // 1. Importar useContext
import { ThemeContext } from '../context/ThemeContext.jsx'; // 2. Importar el Contexto
import styles from './Header.module.css';

function Header() {
  // 3. Consumir el tema y la función de cambio
  const { theme, toggleTheme } = useContext(ThemeContext);

return (
    <header className={styles.header}>
      <Link to="/" className={styles.logoLink}>Mi Portafolio Personal</Link>
      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/proyectos">Proyectos</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
          <li>
            {/* 4. Botón que llama a toggleTheme */}
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