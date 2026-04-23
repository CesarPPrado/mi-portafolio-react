import React, { useCallback, useState } from 'react';
import { UploadCloud, FileType, FileSpreadsheet, FileText, Presentation } from 'lucide-react';

export const FileUpload = ({ onDataParsed }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const processFile = async (file) => {
    setIsLoading(true);
    setError(null);
    try {
      const validExtensions = ['.xlsx', '.xls', '.csv', '.docx', '.pdf', '.pptx', '.ppt'];
      const isValid = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
      
      if (!isValid) {
        throw new Error("Formato no soportado. Sube un archivo Excel, Word o PDF.");
      }

      // Preparar el archivo para enviarlo al backend
      const formData = new FormData();
      formData.append('file', file);

      // Usar la URL base de tu backend
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      const response = await fetch(`${API_URL}/api/analytics/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error procesando el archivo en el servidor.');
      }

      // El backend ahora nos devuelve TODO masticado:
      // result.aiAnalysis (texto markdown)
      // result.type (excel, word, pdf, pptx)
      // result.data (JSON de excel)
      // result.wordFreq (Frecuencia de palabras)
      
      onDataParsed(result);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="card mb-6">
      <div 
        className={`upload-zone ${isDragging ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload').click()}
        style={{ cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <UploadCloud size={64} className="upload-icon mb-4" />
          <h2 className="upload-title">Sube tus datos para analizar</h2>
          <p className="upload-desc mt-4 mb-4 text-center" style={{maxWidth: '450px'}}>
            Arrastra tu archivo aquí o haz clic para buscar. 
            <br/><br/>
            El Cerebro IA en el servidor soporta análisis profundo de:
          </p>
          <div className="flex gap-4 mt-2 mb-4 justify-center flex-wrap">
            <span className="flex items-center gap-2" style={{color: '#00e676'}}><FileSpreadsheet size={18}/> Excel</span>
            <span className="flex items-center gap-2" style={{color: '#0078f2'}}><FileType size={18}/> Word</span>
            <span className="flex items-center gap-2" style={{color: '#ff1744'}}><FileText size={18}/> PDF</span>
            <span className="flex items-center gap-2" style={{color: '#ffb300'}}><Presentation size={18}/> PPTX</span>
          </div>
          <input 
            id="file-upload" 
            type="file" 
            accept=".xlsx,.xls,.csv,.docx,.pdf,.pptx,.ppt" 
            onChange={handleChange} 
            style={{ display: 'none' }} 
          />
        </div>
      </div>
      
      {isLoading && (
        <div className="loader-container">
          <div className="spinner">
            <UploadCloud size={40} />
          </div>
          <p>Enviando archivo al servidor IA...</p>
        </div>
      )}

      {error && (
        <div style={{color: 'var(--error-color)', padding: '1rem', marginTop: '1rem', border: '1px solid var(--error-color)', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(255,23,68,0.1)'}}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};
