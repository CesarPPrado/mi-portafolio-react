// src/pages/Proyectos.jsx
import ProjectsGrid from '../components/ProjectsGrid.jsx';

function Proyectos() {
  return (
    <div>
      {/* Este título es opcional, pero ayuda a saber que estamos en una nueva página */}
      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Mis Proyectos</h1>
      <ProjectsGrid />
    </div>
  );
}

export default Proyectos;