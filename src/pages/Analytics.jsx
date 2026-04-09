import React, { useState, useEffect } from 'react';
import { Activity, LayoutDashboard, Settings, ArrowUp } from 'lucide-react';
import { FileUpload } from '../components/analytics/FileUpload';
import { AIAnalysis } from '../components/analytics/AIAnalysis';
import '../components/analytics/analytics.css';

export default function Dashboard() {
  const [analyzedData, setAnalyzedData] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDataParsed = (newData) => {
    // Agreamos el nuevo archivo al principio
    setAnalyzedData(prev => [newData, ...prev]);
  };

  const handleDismiss = (indexToRemove) => {
    setAnalyzedData(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand-title">
          <Activity color="var(--accent-color)" size={28} />
          <span>Analytics Core</span>
        </div>
        <div className="flex gap-4">
          <button className="btn" title="Dashboard">
            <LayoutDashboard size={20} />
          </button>
          <button className="btn" title="Configuración">
            <Settings size={20} />
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="mb-6">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Dashboard Analítico</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Arrastra tus documentos de Excel o Word. El sistema procesará inteligentemente los datos y generará insights inmediatos en este tablero.
          </p>
        </div>

        <FileUpload onDataParsed={handleDataParsed} />

        {analyzedData.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-6" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', color: 'var(--text-secondary)' }}>
              Análisis Recientes ({analyzedData.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {analyzedData.map((item, idx) => (
                <div key={`${item.data.fileName}-${idx}`} style={{ animation: 'fade-in 0.5s ease-out' }}>
                  <AIAnalysis 
                    dataPayload={item.data} 
                    dataType={item.type} 
                    fileName={item.data.fileName}
                    onDismiss={() => handleDismiss(idx)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: 'rgba(18, 18, 18, 0.8)',
            backdropFilter: 'blur(8px)',
            color: 'white',
            border: '1px solid #333',
            borderRadius: '8px',
            width: '3rem',
            height: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            zIndex: 1000,
            animation: 'fade-in 0.3s ease-out'
          }}
          title="Volver Arriba"
        >
          <ArrowUp size={24} />
        </button>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
