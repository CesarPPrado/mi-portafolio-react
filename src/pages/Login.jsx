// src/pages/Login.jsx
import { useState } from 'react';
import styles from './Form.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Importar nuestro hook 'useAuth'

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();
  const { login } = useAuth(); // 2. Obtener la función 'login' del contexto

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage({ text: 'Iniciando sesión...', type: '' });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // 3. ¡ÉXITO! Usar la función 'login' del contexto
        login(result.token); 

        setStatusMessage({ text: 'Inicio de sesión exitoso. Redirigiendo...', type: 'success' });

        // 4. Redirigir al usuario (sin recargar la página)
        setTimeout(() => {
          navigate('/'); 
        }, 2000);

      } else {
        throw new Error(result.message || 'Error al iniciar sesión.');
      }

    } catch (error) {
      setStatusMessage({ text: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // ... (El JSX del return es el mismo) ...
  return (
    <div className={styles.contactContainer}>
      <h1 className={styles.pageTitle}>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit}>
        {/* ... (tus campos de email y password) ... */}
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className={styles.formInput}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            className={styles.formInput}
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={styles.formButton} disabled={isLoading}>
          {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
        </button>
      </form>
      {statusMessage.text && (
        <p className={`${styles.statusMessage} ${
            statusMessage.type === 'success' ? styles.statusSuccess : styles.statusError
          }`}>
          {statusMessage.text}
        </p>
      )}
    </div>
  );
}

export default Login;