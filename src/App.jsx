// src/App.jsx
import Header from './components/Header.jsx'; // Importar Header
import Hero from './components/Hero.jsx'; // Importar Hero
import ProjectsGrid from './components/ProjectsGrid.jsx'; // Importar ProjectsGrid
import Footer from './components/Footer.jsx'; // Importar Footer

function App() {
  return (
    <div>
      <Header />
      <main>
        <Hero />
        <ProjectsGrid />
      </main>
      <Footer /> {/* 2. Usar el componente Footer al final */}
    </div>
  );
}

export default App;