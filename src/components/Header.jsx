// src/components/Header.jsx

import styles from './Header.module.css'; // 1. Importamos el archivo CSS

function Header() {
  // 2. Usamos "className" en lugar de "class" y aplicamos los estilos importados
  return (
    <header className={styles.header}>
      <h1 id="titulo-principal">Mi Portafolio Personal</h1>
      <nav>
        <ul>
          <li><a href="#">Inicio</a></li>
          <li><a href="#">Proyectos</a></li>
          <li><a href="#">Contacto</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;