import React, { useCallback, useState } from 'react';
import { UploadCloud, FileType, FileSpreadsheet } from 'lucide-react';
import { parseExcelFile } from '../../utils/parseExcel';
import { parseWordFile } from '../../utils/parseWord';

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
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const data = await parseExcelFile(file);
        onDataParsed({ type: 'excel', data });
      } else if (file.name.endsWith('.docx')) {
        const data = await parseWordFile(file);
        onDataParsed({ type: 'word', data });
      } else {
        throw new Error("Formato no soportado. Por favor sube archivos .xlsx o .docx");
      }
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
      >
        <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <UploadCloud size={64} className="upload-icon mb-4" />
          <h2 className="upload-title">Sube tus datos para analizar</h2>
          <p className="upload-desc mt-4 mb-4 text-center" style={{maxWidth: '400px'}}>
            Arrastra tu archivo aquí o haz clic para buscar. 
            <br/><br/>
            Soportamos documentos de <strong>Excel (.xlsx)</strong> para tendencias y <strong>Word (.docx)</strong> para minería de texto.
          </p>
          <div className="flex gap-4 mt-4">
            <span className="flex items-center gap-2" style={{color: '#00e676'}}><FileSpreadsheet size={20}/> Excel</span>
            <span className="flex items-center gap-2" style={{color: '#0078f2'}}><FileType size={20}/> Word</span>
          </div>
          <input 
            id="file-upload" 
            type="file" 
            accept=".xlsx,.xls,.docx" 
            onChange={handleChange} 
            style={{ display: 'none' }} 
          />
        </label>
      </div>
      
      {isLoading && (
        <div className="loader-container">
          <div className="spinner">
            <UploadCloud size={40} />
          </div>
          <p>Procesando archivo inteligentemente...</p>
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
