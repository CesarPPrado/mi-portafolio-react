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

        <div className={styles.socialGrid}>
          <button className={styles.socialButton} aria-label="Xbox">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.969 0C5.356 0 0 5.358 0 11.971c0 6.613 5.356 11.97 11.969 11.97 6.614 0 11.97-5.357 11.97-11.97C23.939 5.358 18.583 0 11.969 0zm-8.32 16.551A11.365 11.365 0 011.66 11.97a10.22 10.22 0 012.355-6.52c4.49 7.025 8.169 7.91 9.4 8.016-3.791 1.777-7.253 1.956-9.766 3.085zm16.702.012c-2.42-1.077-5.748-1.258-9.405-2.923 1.15-.098 4.708-.87 9.176-7.859a10.224 10.224 0 012.38 6.189 11.378 11.378 0 01-2.151 4.593z" />
            </svg>
          </button>
          <button className={styles.socialButton} aria-label="PlayStation">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.15 7.82c-.37-.15-.71-.24-1-.31.02-.12.04-.26.04-.4l-.01-.52-.06-.5-.95-1.92-1.04-1.74-.06-.05v.02s-.88-1.12-2.31-1.39c-.19-.04-.41-.05-.6-.05s-.41.01-.6.05c-1.43.27-2.31 1.39-2.31 1.39v-.02l-.06.05-1.04 1.74-.95 1.92-.06.5-.01.52c0 .14.02.28.04.4-.29.07-.63.16-1 .31C3.13 8.65.68 11.45.68 15c0 3.05 1.83 5.37 4.5 6.35.48.18 1.09.28 1.86.29.62.01 1.31-.05 1.99-.18.72-.14 1.38-.34 1.88-.56v-2.03c-.63.26-1.33.47-1.99.59-.57.1-1.12.16-1.63.16-.62 0-1.11-.08-1.51-.23-1.66-.61-2.61-2.16-2.61-4.35 0-2.4 1.73-4.35 4.35-5.06l1.39-.37v3.25h1.2v-3.56l1.37.36c2.62.7 4.38 2.67 4.38 5.09 0 2.2-1 3.76-2.7 4.37-.41.15-1 .24-1.68.25-.56.01-1.16-.05-1.78-.16-.67-.12-1.32-.3-1.89-.5lv-2.05h1.2v2.22c.63.25 1.3.43 1.91.54.51.09 1.02.14 1.51.14.73 0 1.25-.09 1.68-.24 2.87-1 4.54-3.3 4.54-6.31.01-3.66-2.52-6.57-6-7.53z" />
            </svg>
          </button>
          <button className={styles.socialButton} aria-label="Nintendo">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.984 0v21.579c3.921-.064 7.086-3.264 7.086-7.15V0h-7.086zm3.541 6.516c1.157 0 2.096.942 2.096 2.102 0 1.158-.939 2.1-2.096 2.1a2.108 2.108 0 01-2.103-2.1c0-1.16.946-2.102 2.103-2.102zm-9.043.914a2.103 2.103 0 00-2.101 2.1v14.47h6.634V2.26C8.093 3.642 7.482 5.05 7.482 7.43z" />
            </svg>
          </button>
          <button className={styles.socialButton} aria-label="Steam">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.968 0a12 12 0 00-8.216 20.738l3.434-5.011a6.002 6.002 0 014.282-5.462l2.308-3.32v-.108a3.35 3.35 0 113.353 3.35 3.35 3.35 0 01-.645-.065L12.56 12.87h-.104a4.154 4.154 0 11-4.04-5.055 4.15 4.15 0 013.552 2.01zm5.176 9.476a1.092 1.092 0 10-.001-2.185 1.092 1.092 0 00.001 2.185zm-9.673 8.35c.162-.058 1.488-.53 1.488-.53.491.246 1.04.385 1.62.385.597 0 1.167-.148 1.666-.41l.056-.03-2.617-1.127.01-1.353.642 1.25s1.298.544 1.343.518a4.137 4.137 0 01-1.282-4.081L3.921 16.48c.84 2.115 2.185 3.014 3.549 3.535z" />
            </svg>
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