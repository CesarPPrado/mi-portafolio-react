// src/components/Hero.jsx
import styles from './Hero.module.css'; // Importamos los estilos
function Hero() {
  // Aplicamos las clases usando el objeto styles
  return (
    <section className={styles.hero}>
      <h2 className={styles.heroTitle}>Desarrollador de Software</h2>
      <p>
        Hola, soy César Prado. Un apasionado desarrollador en formación, enfocado en crear soluciones de software eficientes y escalables.
      </p>
      <a href="#" className={styles.heroButton}>Mis Proyectos</a>
    </section>
  );
}
export default Hero;