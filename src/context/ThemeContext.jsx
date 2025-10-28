// src/context/ThemeContext.jsx
import { createContext, useState } from 'react';

// 1. Crear el Contexto
const ThemeContext = createContext();

/**
 * Componente "Proveedor" que envolverá nuestra aplicación.
 */
function ThemeProvider({ children }) {
  // 2. Definir el estado. Inicia en 'dark' por defecto.
  const [theme, setTheme] = useState('dark');

  // 3. Función para cambiar el tema
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // 4. El "Proveedor" entrega el estado 'theme' y la función 'toggleTheme'
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeContext, ThemeProvider };