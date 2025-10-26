// src/components/ProjectCard.jsx
import styles from './ProjectCard.module.css';

/**
 * Componente reutilizable que renderiza una tarjeta
 * para un proyecto individual.
 * @param {object} props - Propiedades pasadas al componente.
 * @param {string} props.title - El título del proyecto.
 * @param {string} props.description - La descripción del proyecto.
 */
function ProjectCard({ title, description }) {
  return (
    <div className={styles.card}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default ProjectCard;