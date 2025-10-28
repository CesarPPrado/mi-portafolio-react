// src/pages/Proyectos.jsx
import ProjectsGrid from '../components/ProjectsGrid.jsx';

function Proyectos() {
  return (
    <div>
      <h1 className="page-title">Mis Proyectos</h1>
      
      {/* 1. Pasa la nueva prop 'showTitle' como 'false' */}
      <ProjectsGrid showTitle={false} />
      
    </div>
  );
}

export default Proyectos;