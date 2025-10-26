// src/components/ProjectsGrid.jsx
import { useState, useEffect } from 'react'; // 1. Importar Hooks de React
import ProjectCard from './ProjectCard.jsx';
import styles from './ProjectsGrid.module.css';

/**
 * Componente que muestra una cuadrícula de proyectos,
 * obteniendo los datos dinámicamente desde la API.
 */
function ProjectsGrid() {
  // 2. Crear un "estado" para almacenar la lista de proyectos.
  //    Inicia como un arreglo vacío.
  const [projects, setProjects] = useState([]);

  // 3. Usar "useEffect" para ejecutar código cuando el componente se monta.
  //    El arreglo vacío al final `[]` asegura que esto se ejecute solo una vez.
  useEffect(() => {
    // 4. Usar la API fetch del navegador para llamar a nuestro backend
    fetch('http://localhost:3001/api/proyectos')
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
      <h2>Mis Proyectos</h2>
      <div className={styles.proyectosGrid}>
        
        {/* 6. Mapear (recorrer) el estado "projects" y renderizar 
               un ProjectCard por cada uno. */}
        {projects.map(project => (
          <ProjectCard 
            key={project.id} // "key" es un prop especial y requerido en React para las listas
            title={project.title} 
            description={project.description} 
          />
        ))}

      </div>
    </section>
  );
}

export default ProjectsGrid;