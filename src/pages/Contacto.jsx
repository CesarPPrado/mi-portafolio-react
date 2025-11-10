// src/pages/Contacto.jsx
import { useState, useEffect } from 'react'; // 1. Importar useEffect
import styles from './Contacto.module.css';

const LOCAL_STORAGE_KEY = 'contactFormData'; // Definimos una llave

function Contacto() {
  
  // 2. Al iniciar, el estado se carga desde localStorage si existe
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : { name: '', email: '', message: '' };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  // 3. Este "efecto" se ejecuta CADA VEZ que 'formData' cambia
  useEffect(() => {
    // Guarda el estado actual en localStorage en cada tecleo
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]); // Se dispara solo cuando 'formData' cambia

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
    setStatusMessage({ text: 'Enviando...', type: '' });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setStatusMessage({ text: result.message, type: 'success' });
        
        // 4. Limpiar el formulario Y localStorage después del éxito
        setFormData({ name: '', email: '', message: '' }); 
        localStorage.removeItem(LOCAL_STORAGE_KEY); // Limpieza explícita
        
      } else {
        throw new Error(result.message || 'Error al enviar el mensaje.');
      }

    } catch (error) {
      setStatusMessage({ text: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // ... (tu JSX del 'return' sigue siendo exactamente el mismo) ...
  return (
    <div className={styles.contactContainer}>
      <h1 className={styles.pageTitle}>Página de Contacto</h1>
      <p style={{ textAlign: 'center', marginBottom: '20px' }}>
        ¿Tienes alguna pregunta o propuesta? ¡Envíame un mensaje!
      </p>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            className={styles.formInput}
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

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
          <label htmlFor="message">Mensaje</label>
          <textarea
            id="message"
            name="message"
            className={styles.formTextarea}
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button type="submit" className={styles.formButton} disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Enviar Mensaje'}
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

export default Contacto;