// src/components/ProjectCard.jsx
import styles from './ProjectCard.module.css';

/**
 * Componente reutilizable que renderiza una tarjeta
 * para un proyecto con estilo de videojuegos.
 */
function ProjectCard({ title, description, imageUrl }) {
  // Una imagen de muestra general si no hay URL
  const placeholderImg = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={imageUrl || placeholderImg} alt={title} className={styles.image} />
        {/* Capa de destello o sombra al hacer hover */}
        <div className={styles.hoverOverlay}></div>
      </div>
      
      <div className={styles.content}>
        <span className={styles.tag}>Juego base</span>
        <h3 className={styles.title}>{title}</h3>
        {/* Solo la primera línea de descripcion para no romper el layout */}
        <p className={styles.description}>{description?.substring(0, 50)}...</p>
        <span className={styles.price}>Gratis</span>
      </div>
    </div>
  );
}

export default ProjectCard;