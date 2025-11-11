// src/pages/Register.jsx
import { useState } from 'react';
import styles from './Form.module.css'; // 1. Reutilizamos los estilos del formulario
import { useNavigate } from 'react-router-dom'; // 2. Importamos 'useNavigate' para redirigir

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate(); // 3. Inicializamos el hook de navegación

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
    setStatusMessage({ text: 'Registrando...', type: '' });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setStatusMessage({ text: result.message, type: 'success' });
        setFormData({ email: '', password: '' });

        // 4. ¡Éxito! Espera 2 segundos y redirige al login
        setTimeout(() => {
          navigate('/login');
        }, 2000);

      } else {
        throw new Error(result.message || 'Error al registrar el usuario.');
      }

    } catch (error) {
      setStatusMessage({ text: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 5. Usamos los mismos nombres de clase que el formulario de contacto
    <div className={styles.contactContainer}>
      <h1 className={styles.pageTitle}>Crear Cuenta</h1>

      <form onSubmit={handleSubmit}>
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
            minLength="6" // Es buena práctica añadir validación simple
          />
        </div>

        <button type="submit" className={styles.formButton} disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Crear Cuenta'}
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

export default Register;