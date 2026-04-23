import { useState, useMemo } from 'react';
import styles from './Palettes.module.css';
import { generatePalette } from '../utils/colorUtils';

const paletteTypes = ['Todos', 'Degradado', 'Minimalista', 'Vibrante', 'Pastel'];
const generatorModes = ['Degradado', 'Minimalista', 'Vibrante', 'Pastel', 'Complementario'];

const palettesData = [
  // Degradado
  { id: 1, name: 'Sunset Glow', type: 'Degradado', colors: ['#FF5E3A', '#FF9500', '#FFCC00', '#F0F0F0'] },
  { id: 2, name: 'Ocean Breeze', type: 'Degradado', colors: ['#0078F2', '#00C6FF', '#74EBD5', '#E0F2FE'] },
  { id: 9, name: 'Forest Path', type: 'Degradado', colors: ['#1D976C', '#4CB8C4', '#93F9B9', '#F0FFF0'] },
  { id: 10, name: 'Purple Dream', type: 'Degradado', colors: ['#8E2DE2', '#4A00E0', '#B06AB3', '#E0C3FC'] },

  // Minimalista
  { id: 3, name: 'Dark Void', type: 'Minimalista', colors: ['#121212', '#18181C', '#2A2A2E', '#F5F5F5'] },
  { id: 4, name: 'Modern Clean', type: 'Minimalista', colors: ['#FFFFFF', '#F0F0F0', '#333336', '#121212'] },
  { id: 11, name: 'Neutral Ash', type: 'Minimalista', colors: ['#EAEAEA', '#D3D3D3', '#8C8C8C', '#4F4F4F'] },
  { id: 12, name: 'Deep Space', type: 'Minimalista', colors: ['#0B0C10', '#1F2833', '#C5C6C7', '#45A29E'] },

  // Vibrante
  { id: 5, name: 'Cyberpunk', type: 'Vibrante', colors: ['#FF003C', '#F3E600', '#00E6F6', '#121212'] },
  { id: 6, name: 'Neon Nights', type: 'Vibrante', colors: ['#B800FF', '#00FF9D', '#FF007F', '#18181C'] },
  { id: 13, name: 'Retro Wave', type: 'Vibrante', colors: ['#F72585', '#7209B7', '#3A0CA3', '#4CC9F0'] },
  { id: 14, name: 'Acid Green', type: 'Vibrante', colors: ['#CCFF00', '#00FF00', '#00FFFF', '#FF00FF'] },

  // Pastel
  { id: 7, name: 'Spring Morning', type: 'Pastel', colors: ['#FFD1DC', '#B5EAD7', '#C7CEEA', '#E2F0CB'] },
  { id: 8, name: 'Warm Sand', type: 'Pastel', colors: ['#FAD0C4', '#FFD1FF', '#FF9A9E', '#FECFEF'] },
  { id: 15, name: 'Cotton Candy', type: 'Pastel', colors: ['#FFB7B2', '#FF9CB1', '#E2F0CB', '#B5EAD7'] },
  { id: 16, name: 'Muted Earth', type: 'Pastel', colors: ['#D4A373', '#CCD5AE', '#E9EDC9', '#FEFAE0'] }
];

function Palettes() {
  const [viewMode, setViewMode] = useState('explorar'); // 'explorar' | 'generador'
  const [activeType, setActiveType] = useState('Todos');
  const [copiedColor, setCopiedColor] = useState(null);

  // Generator State
  const [baseColor, setBaseColor] = useState('#0078F2');
  const [genMode, setGenMode] = useState('Degradado');
  const [genCount, setGenCount] = useState(5);

  const filteredPalettes = palettesData.filter(
    (palette) => activeType === 'Todos' || palette.type === activeType
  );

  const generatedPalette = useMemo(() => {
    return generatePalette(baseColor, genMode, genCount);
  }, [baseColor, genMode, genCount]);

  const handleCopy = (color) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => {
      setCopiedColor(null);
    }, 2000);
  };

  const handleAddColor = () => {
    if (genCount < 12) setGenCount(prev => prev + 1);
  };

  const handleRemoveColor = () => {
    if (genCount > 3) setGenCount(prev => prev - 1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className="page-title">Paletas de Colores</h1>
        <p>
          Encuentra la combinación perfecta o genera una nueva paleta a partir de tu color favorito.
        </p>
      </div>

      <div className={styles.viewTabs}>
        <button
          className={`${styles.tabBtn} ${viewMode === 'explorar' ? styles.activeTab : ''}`}
          onClick={() => setViewMode('explorar')}
        >
          Explorar Paletas
        </button>
        <button
          className={`${styles.tabBtn} ${viewMode === 'generador' ? styles.activeTab : ''}`}
          onClick={() => setViewMode('generador')}
        >
          Generador Automático
        </button>
      </div>

      {viewMode === 'explorar' && (
        <>
          <div className={styles.selectorContainer}>
            {paletteTypes.map((type) => (
              <button
                key={type}
                className={`${styles.typeBtn} ${activeType === type ? styles.active : ''}`}
                onClick={() => setActiveType(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <div className={styles.grid}>
            {filteredPalettes.map((palette) => (
              <div key={palette.id} className={styles.card}>
                <h3>{palette.name}</h3>

                <div className={styles.swatchRow}>
                  {palette.colors.map((color, index) => (
                    <div
                      key={index}
                      className={styles.swatchItem}
                      style={{ backgroundColor: color }}
                      onClick={() => handleCopy(color)}
                      title={`Copiar ${color}`}
                    ></div>
                  ))}
                </div>

                <div className={styles.colorsList}>
                  {palette.colors.map((color, index) => (
                    <div
                      key={index}
                      className={styles.colorHex}
                      onClick={() => handleCopy(color)}
                    >
                      <span
                        className={styles.colorDot}
                        style={{ backgroundColor: color }}
                      ></span>
                      <span className={styles.colorCode}>{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {viewMode === 'generador' && (
        <div className={styles.generatorContainer}>
          <div className={styles.generatorControls}>
            <div className={styles.colorPickerGroup}>
              <label>Color Base</label>
              <div className={styles.colorInputWrapper}>
                <input
                  type="color"
                  value={baseColor.startsWith('#') && baseColor.length === 7 ? baseColor : '#000000'}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className={styles.colorInput}
                />
                <input
                  type="text"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className={styles.colorInputValueInput}
                  placeholder="#HEX / RGB"
                />
              </div>
            </div>

            <div className={styles.modeGroup}>
              <label>Modo de Generación</label>
              <div className={styles.modeButtons}>
                {generatorModes.map((mode) => (
                  <button
                    key={mode}
                    className={`${styles.typeBtn} ${genMode === mode ? styles.active : ''}`}
                    onClick={() => setGenMode(mode)}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.generatedPaletteCard}>
            <div className={styles.swatchRowGen}>
              {generatedPalette.map((color, index) => (
                <div
                  key={index}
                  className={styles.swatchItemGen}
                  style={{ backgroundColor: color }}
                  onClick={() => handleCopy(color)}
                  title={`Copiar ${color}`}
                >
                  <span className={styles.swatchTooltip}>Copiar</span>
                </div>
              ))}
            </div>

            <div className={styles.colorsListGen}>
              {generatedPalette.map((color, index) => (
                <div
                  key={index}
                  className={styles.colorHex}
                  onClick={() => handleCopy(color)}
                >
                  <span
                    className={styles.colorDot}
                    style={{ backgroundColor: color }}
                  ></span>
                  <span className={styles.colorCode}>{color}</span>
                </div>
              ))}
            </div>

            <div className={styles.actionButtons}>
              <button
                className={styles.actionBtn}
                onClick={handleRemoveColor}
                disabled={genCount <= 3}
              >
                Eliminar Color
              </button>
              <span className={styles.colorCountBadge}>{genCount} Colores</span>
              <button
                className={styles.actionBtn}
                onClick={handleAddColor}
                disabled={genCount >= 12}
              >
                Agregar Color
              </button>
            </div>
          </div>
        </div>
      )}

      {copiedColor && (
        <div className={styles.toast}>
          ¡Color {copiedColor} copiado!
        </div>
      )}
    </div>
  );
}

export default Palettes;
