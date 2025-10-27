// src/components/ProjectsGrid.jsx
import { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard.jsx';
import styles from './ProjectsGrid.module.css';

// 1. Acepta la nueva prop "showTitle", con "true" como valor por defecto
function ProjectsGrid({ showTitle = true }) {
  const [projects, setProjects] = useState([]);

  // 3. Usar "useEffect" para ejecutar código cuando el componente se monta.
  //    El arreglo vacío al final `[]` asegura que esto se ejecute solo una vez.
  useEffect(() => {
    // 4. Usar la API fetch del navegador para llamar a nuestro backend
    fetch(`${import.meta.env.VITE_API_URL}/api/proyectos`)
      .then(response => response.json()) // Convertir la respuesta a JSON
      .then(data => {
        // 5. Guardar los datos de la API en nuestro estado
        setProjects(data);
      })
      .catch(error => {
        // Manejo básico de errores
        console.error('Error al obtener los proyectos:', error);
      });
  }, []); // El arreglo vacío significa "ejecutar solo al montar"

return (
    <section id="proyectos" className={styles.proyectosSection}>
      
      {/* 2. Renderiza el título H2 SÓLO SI showTitle es true */}
      {showTitle && <h2>Mis Proyectos</h2>}

      <div className={styles.proyectosGrid}>
        {projects.map(project => (
          <ProjectCard 
            key={project.id}
            title={project.title} 
            description={project.description} 
          />
        ))}
      </div>
    </section>
  );
}

export default ProjectsGrid;