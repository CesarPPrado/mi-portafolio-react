// src/pages/Register.jsx
import { useState } from 'react';
import styles from './Form.module.css';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

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
    <div className={styles.pageWrapper}>
      <div className={styles.contactContainer}>
        
        <div className={styles.logoContainer}>
          <svg className={styles.logo} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path d="M24 0L1 24l23 24 23-24L24 0zm0 18.2L15.6 24 24 29.8 32.4 24 24 18.2z" />
          </svg>
        </div>

        <h1 className={styles.pageTitle}>Crear Cuenta</h1>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Dirección de correo electrónico</label>
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
              minLength="6"
            />
          </div>

          <button type="submit" className={styles.formButton} disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Continuar'}
          </button>
        </form>

        <div className={styles.formLinkContainer}>
          ¿Ya tienes cuenta? <Link to="/login" className={styles.formLink}>Iniciar sesión</Link>
        </div>

        {statusMessage.text && (
          <p className={`${styles.statusMessage} ${
              statusMessage.type === 'success' ? styles.statusSuccess : styles.statusError
            }`}>
            {statusMessage.text}
          </p>
        )}
      </div>
    </div>
  );
}

export default Register;