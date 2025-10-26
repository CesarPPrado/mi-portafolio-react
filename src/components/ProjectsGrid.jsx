// src/components/ProjectsGrid.jsx
import ProjectCard from './ProjectCard.jsx';
import styles from './ProjectsGrid.module.css';

/**
 * Componente que muestra una cuadrícula de proyectos.
 */
function ProjectsGrid() {
  return (
    <section id="proyectos" className={styles.proyectosSection}>
      <h2>Mis Proyectos</h2>
      <div className={styles.proyectosGrid}>

        {/* Pasamos los datos de cada proyecto como props */}
        <ProjectCard 
          title="Portafolio v1 (HTML/CSS)" 
          description="La primera versión de mi portafolio, creada con HTML, CSS y JavaScript puro. Enfocado en el diseño responsivo con Flexbox y Grid." 
        />
        <ProjectCard 
          title="Proyecto Dos (Próximamente)" 
          description="Descripción breve de lo que tratará este proyecto, las tecnologías utilizadas y el problema que resolverá." 
        />
        <ProjectCard 
          title="Proyecto Tres (Próximamente)" 
          description="Descripción breve de lo que tratará este proyecto, las tecnologías utilizadas y el problema que resolverá." 
        />

      </div>
    </section>
  );
}

export default ProjectsGrid;