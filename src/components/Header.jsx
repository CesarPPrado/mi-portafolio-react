// src/components/Header.jsx
import { Link } from 'react-router-dom'; // 1. Importar 'Link'
import styles from './Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      {/* 2. Cambiar la etiqueta <a> por 'Link' y 'href' por 'to' */}
      <Link to="/" className={styles.logoLink}>Mi Portafolio Personal</Link>
      <nav>
        <ul>
          {/* 3. Hacer lo mismo para todos los enlaces de navegación */}
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/proyectos">Proyectos</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;