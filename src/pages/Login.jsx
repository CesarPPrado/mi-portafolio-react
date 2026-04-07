// src/pages/Login.jsx
import { useState } from 'react';
import styles from './Form.module.css';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

        <div className={styles.socialList}>
          <button className={styles.socialListButton} aria-label="Continuar con Google">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </button>
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