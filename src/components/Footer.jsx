// src/components/Footer.jsx
import styles from './Footer.module.css';

/**
 * Componente que renderiza el pie de página del sitio.
 */
function Footer() {
  // Obtenemos el año actual dinámicamente
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p>&copy; {currentYear} César Prado. Todos los derechos reservados.</p>
    </footer>
  );
}

export default Footer;