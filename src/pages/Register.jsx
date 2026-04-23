// src/pages/Register.jsx
import { useState } from 'react';
import styles from './Form.module.css';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    displayName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
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
        body: JSON.stringify({ email: formData.email, password: formData.password, name: formData.firstName + " " + formData.lastName }),
      });

      const result = await response.json();

      if (response.ok) {
        setStatusMessage({ text: result.message || 'Cuenta creada', type: 'success' });
        setFormData({ email: '', firstName: '', lastName: '', password: '', displayName: '' });

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
        setStatusMessage({ text: result.isNewUser ? 'Cuenta creada exitosamente con Google. Redirigiendo...' : 'Inicio de sesión exitoso. Redirigiendo...', type: 'success' });
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
    setStatusMessage({ text: 'El registro con Google fue cancelado o falló.', type: 'error' });
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.contactContainer}>
        
        <h1 className={styles.pageTitle} style={{ textAlign: 'left', marginBottom: '30px' }}>Crea tu cuenta</h1>

        <form onSubmit={handleSubmit}>
          
          <div className={styles.waveGroup}>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.waveInput}
              value={formData.email}
              onChange={handleChange}
              required
            />
            <span className={styles.waveBar} />
            <label className={styles.waveLabel}>
              {Array.from('Correo Electrónico').map((char, index) => (
                <span key={index} className={styles.waveLabelChar} style={{ '--index': index }}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </label>
          </div>

          <div className={styles.rowGroup}>
            <div className={styles.waveGroup}>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className={styles.waveInput}
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <span className={styles.waveBar} />
              <label className={styles.waveLabel}>
                {Array.from('Nombre').map((char, index) => (
                  <span key={index} className={styles.waveLabelChar} style={{ '--index': index }}>{char}</span>
                ))}
              </label>
            </div>
            <div className={styles.waveGroup}>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className={styles.waveInput}
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <span className={styles.waveBar} />
              <label className={styles.waveLabel}>
                {Array.from('Apellidos').map((char, index) => (
                  <span key={index} className={styles.waveLabelChar} style={{ '--index': index }}>{char}</span>
                ))}
              </label>
            </div>
          </div>

          <div className={styles.waveGroup}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className={styles.waveInput}
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
            <span className={styles.waveBar} />
            <label className={styles.waveLabel}>
              {Array.from('Crear contraseña').map((char, index) => (
                <span key={index} className={styles.waveLabelChar} style={{ '--index': index }}>{char === ' ' ? '\u00A0' : char}</span>
              ))}
            </label>
            <div className={styles.inputActions} style={{ top: '10px' }}>
              <button 
                type="button" 
                className={styles.iconButton} 
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
              <div className={styles.tooltipContainer}>
                <div className={styles.iconButton}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <div className={styles.tooltip}>
                  Las contraseñas deben tener más de 7 caracteres, contener al menos 1 número y 1 letra y no contener ningún espacio en blanco.
                </div>
              </div>
            </div>
          </div>

          <div className={styles.waveGroup}>
            <input
              type="text"
              id="displayName"
              name="displayName"
              className={styles.waveInput}
              value={formData.displayName}
              onChange={handleChange}
              required
            />
            <span className={styles.waveBar} />
            <label className={styles.waveLabel}>
              {Array.from('Nombre en pantalla').map((char, index) => (
                <span key={index} className={styles.waveLabelChar} style={{ '--index': index }}>{char === ' ' ? '\u00A0' : char}</span>
              ))}
            </label>
            <div className={styles.inputActions} style={{ top: '10px' }}>
              <div className={styles.tooltipContainer}>
                <div className={styles.iconButton}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <div className={styles.tooltip}>
                  Tu nombre en pantalla debe tener entre 3 y 16 caracteres, y puede contener letras, números y guiones, puntos, guiones bajos y espacios no consecutivos.
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className={styles.formButton} disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Continuar'}
          </button>
        </form>

        <div className={styles.divider}>Otras formas de registrarse</div>

        <div className={styles.socialList} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_black"
              shape="rectangular"
              text="continue_with"
              width="300"
            />
          </div>
        </div>

        <div className={styles.formLinkContainer}>
          ¿Ya tienes una cuenta? <Link to="/login" className={styles.formLink}>Iniciar sesión</Link>
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