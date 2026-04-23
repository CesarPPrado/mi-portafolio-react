// src/pages/Login.jsx
import { useState } from 'react';
import styles from './Form.module.css';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

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
        login(result.token); 
        setStatusMessage({ text: 'Inicio de sesión exitoso. Redirigiendo...', type: 'success' });
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

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setStatusMessage({ text: 'Iniciando sesión con Google...', type: '' });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const result = await response.json();

      if (response.ok) {
        login(result.token); 
        setStatusMessage({ text: 'Inicio de sesión exitoso. Redirigiendo...', type: 'success' });
        setTimeout(() => {
          navigate('/'); 
        }, 2000);
      } else {
        throw new Error(result.message || 'Error al iniciar sesión con Google.');
      }
    } catch (error) {
      setStatusMessage({ text: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setStatusMessage({ text: 'El inicio de sesión con Google fue cancelado o falló.', type: 'error' });
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.contactContainer}>
        
        <div className={styles.logoContainer}>
          <svg className={styles.logo} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path d="M24 0L1 24l23 24 23-24L24 0zm0 18.2L15.6 24 24 29.8 32.4 24 24 18.2z" />
          </svg>
        </div>

        <h1 className={styles.pageTitle}>Iniciar Sesión</h1>
        
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
            />
          </div>
          <button type="submit" className={styles.formButton} disabled={isLoading}>
            {isLoading ? 'Iniciando...' : 'Continuar'}
          </button>
        </form>

        <div className={styles.divider}>Otras formas de iniciar sesión</div>

        <div className={styles.socialList} style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_black"
            shape="rectangular"
            text="continue_with"
            width="300"
          />
        </div>

        <div className={styles.formLinkContainer}>
          ¿Es la primera vez que estás aquí? <Link to="/register" className={styles.formLink}>Crear una cuenta</Link>
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

export default Login;