// src/App.jsx
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx'; // 1. Importa el componente Hero
function App() {
  return (
    <div>
      <Header />
      <main>
        <Hero /> {/* 2. Usa el componente Hero */}
        {/* La sección de proyectos irá aquí más adelante */}
      </main>
    </div>
  );
}
export default App;