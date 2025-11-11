// src/context/AuthContext.jsx
import { createContext, useState, useContext } from 'react';

// 1. Crear el Contexto
const AuthContext = createContext();

/**
 * Componente "Proveedor" que envolverá nuestra aplicación.
 */
function AuthProvider({ children }) {
  // 2. Estado para guardar el token.
  //    Al iniciar, intenta leer el token de localStorage.
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // 3. Función de Login: guarda el token en el estado Y en localStorage
  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  // 4. Función de Logout: borra el token del estado Y de localStorage
  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  // 5. El "valor" que proveemos: el token actual, y las funciones
  const value = {
    token,
    isLoggedIn: !!token, // Un booleano simple (true si hay token, false si no)
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook personalizado para consumir el contexto fácilmente
 * en otros componentes.
 */
const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthContext, AuthProvider, useAuth };