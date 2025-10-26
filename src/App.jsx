// src/App.jsx
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import ProjectsGrid from './components/ProjectsGrid.jsx'; // 1. Importar ProjectsGrid

function App() {
  return (
    <div>
      <Header />
      <main>
        <Hero />
        <ProjectsGrid /> {/* 2. Usar el componente del grid */}
      </main>
    </div>
  );
}

export default App;