import { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState('visual'); // 'visual' o 'edit'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            logout();
            navigate('/login');
            throw new Error('Sesión expirada');
          }
          throw new Error('Error al cargar el perfil');
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate, logout]);

  const handleDeletePalette = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta paleta?')) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/user/palettes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Error al eliminar');

      const updatedPalettes = await response.json();
      setUser({ ...user, palettes: updatedPalettes });
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading) return <div className={styles.loading}>Cargando tu perfil...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!user) return null;

  return (
    <div className={styles.profileContainer}>
      <header className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className={styles.name}>{user.name || 'Usuario'}</h1>
            <p className={styles.email}>{user.email}</p>
          </div>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }} className={styles.logoutBtn}>
          Cerrar Sesión
        </button>
      </header>

      <section className={styles.content}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${viewMode === 'visual' ? styles.activeTab : ''}`}
            onClick={() => setViewMode('visual')}
          >
            Vista Visual
          </button>
          <button 
            className={`${styles.tab} ${viewMode === 'edit' ? styles.activeTab : ''}`}
            onClick={() => setViewMode('edit')}
          >
            Modo Edición
          </button>
        </div>

        <div className={styles.palettesSection}>
          <h2>Mis Paletas Guardadas</h2>
          {(!user.palettes || user.palettes.length === 0) ? (
            <p className={styles.emptyMessage}>Aún no tienes paletas guardadas. ¡Genera algunas en la sección de Colorimetría!</p>
          ) : viewMode === 'visual' ? (
            <div className={styles.palettesGrid}>
              {user.palettes.map(palette => (
                <div key={palette.id} className={styles.paletteCard}>
                  <div className={styles.colorsRow}>
                    {palette.colors.map((color, i) => (
                      <div key={i} className={styles.colorBlock} style={{ backgroundColor: color }}>
                        <span className={styles.colorHex}>{color}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.paletteInfo}>
                    <h3>{palette.name}</h3>
                    <p>{palette.description || new Date(palette.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Colores</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {user.palettes.map(palette => (
                    <tr key={palette.id}>
                      <td>{palette.name}</td>
                      <td>
                        <div className={styles.miniColors}>
                          {palette.colors.map((color, i) => (
                            <div key={i} className={styles.miniColor} style={{ backgroundColor: color }} title={color} />
                          ))}
                        </div>
                      </td>
                      <td>{new Date(palette.date).toLocaleDateString()}</td>
                      <td>
                        <button 
                          className={styles.deleteBtn}
                          onClick={() => handleDeletePalette(palette.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Profile;
