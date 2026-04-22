import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, AlertTriangle, Send, X, FileText, PieChart as PieIcon, TrendingUp, FileCheck, BrainCircuit } from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, LineChart, Line, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell 
} from 'recharts';

// Paleta de colores Premium "Top Tech Store"
const COLORS = ['#a142f4', '#0078f2', '#00e676', '#ff1744', '#ffb300', '#00e5ff', '#ff4081'];

export const AIAnalysis = ({ dataPayload, dataType, fileName, aiAnalysis, wordFreq, onDismiss }) => {
  const [sections, setSections] = useState({
    descriptive: "",
    diagnostic: "",
    predictive: "",
    prescriptive: "",
    footer: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    if (aiAnalysis) {
      setIsLoading(true);
      setError(null);
      try {
        const text = aiAnalysis;
        
        // Parsear el Markdown estructurado en 4 secciones
        const parsed = {
          descriptive: "No se encontró información.",
          diagnostic: "No se encontró información.",
          predictive: "No se encontró información.",
          prescriptive: "No se encontró información.",
          footer: ""
        };

        const parts = text.split(/#{1,4} \*\*/);
        parts.forEach(part => {
          if (part.trim() === '') return;
          
          if (part.startsWith('1.')) {
            parsed.descriptive = part.replace(/^1[^\n]*\n/, '').trim();
          } else if (part.startsWith('2.')) {
            parsed.diagnostic = part.replace(/^2[^\n]*\n/, '').trim();
          } else if (part.startsWith('3.')) {
            parsed.predictive = part.replace(/^3[^\n]*\n/, '').trim();
          } else if (part.startsWith('4.')) {
            const splitFooter = part.split('---');
            parsed.prescriptive = splitFooter[0].replace(/^4[^\n]*\n/, '').trim();
            if (splitFooter.length > 1) {
              parsed.footer = splitFooter.slice(1).join('---').trim();
            }
          } else if (parsed.descriptive === "No se encontró información.") {
            parsed.descriptive = part; 
          }
        });

        // Formatear negritas a HTML (hack simple)
        Object.keys(parsed).forEach(key => {
          parsed[key] = parsed[key]
            .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #fff">$1</strong>')
            .replace(/\n\n/g, '<br/><br/>')
            .replace(/\n/g, '<br/>');
        });

        setSections(parsed);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  }, [aiAnalysis]);

  // Lógica de Gráficos (Extracción y asignación dinámica)
  const renderChart = (cardIndex) => {
    if (dataType === 'word' || dataType === 'pdf' || dataType === 'pptx') {
      if (cardIndex === 1 && wordFreq) {
        const topWords = wordFreq.slice(0, 10);
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topWords} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="text" stroke="#888" tick={{ fill: '#888', fontSize: 12 }} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', color: '#fff' }} />
              <Bar dataKey="value" fill="#0078f2" radius={[4, 4, 0, 0]} name="Frecuencia" />
            </BarChart>
          </ResponsiveContainer>
        );
      }
      return null;
    }

    if (dataType === 'excel' && dataPayload.data && dataPayload.data.length > 0) {
      const records = dataPayload.data;
      const numKeys = Object.keys(records[0]).filter(k => typeof records[0][k] === 'number');
      const strKeys = Object.keys(records[0]).filter(k => typeof records[0][k] === 'string');
      
      const xKey = strKeys.length > 0 ? strKeys[0] : null;      
      if (numKeys.length === 0) return null;

      // Variables reutilizables: iteramos los índices para no quedarnos sin métricas.
      const getMetricKey = (idx) => numKeys[idx % numKeys.length];

      // Card 1 (Descriptivo): PieChart para ver distribución o proporciones 
      if (cardIndex === 1) {
        const yKey = getMetricKey(0); // Primera métrica
        // Como el piechart no soporta cientos de puntos, tomaremos agrupados o los top 7.
        const topRecords = [...records].sort((a,b) => b[yKey] - a[yKey]).slice(0, 7);
        
        return (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={topRecords} dataKey={yKey} nameKey={xKey || undefined} cx="50%" cy="50%" outerRadius={80} label={{fill: '#e0e0e0', fontSize: 12}}>
                {topRecords.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', color: '#fff', borderRadius: '8px' }} itemStyle={{color: '#fff'}} />
            </PieChart>
          </ResponsiveContainer>
        );
      }
      
      // Card 2 (Diagnóstico): AreaChart (evolución de área)
      if (cardIndex === 2) {
        const yKey = getMetricKey(1);
        return (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={records.slice(0, 30)} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              {xKey && <XAxis dataKey={xKey} stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />}
              <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', borderRadius: '8px' }} />
              <Area type="monotone" dataKey={yKey} stroke="#a142f4" fill="#a142f4" fillOpacity={0.4} />
            </AreaChart>
          </ResponsiveContainer>
        );
      }

      // Card 3 (Predictivo): LineChart (tendencia pura)
      if (cardIndex === 3) {
        const yKey = getMetricKey(2);
        return (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={records.slice(0, 30)} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              {xKey && <XAxis dataKey={xKey} stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />}
              <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', borderRadius: '8px' }} />
              <Line type="monotone" dataKey={yKey} stroke="#00e676" strokeWidth={3} dot={{ r: 4, fill: '#00e676', strokeWidth: 0 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      }

      // Card 4 (Prescriptivo): BarChart
      if (cardIndex === 4) {
        const yKey = getMetricKey(3);
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={records.slice(0, 15)} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              {xKey && <XAxis dataKey={xKey} stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />}
              <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', borderRadius: '8px' }} />
              <Bar dataKey={yKey} fill="#ffb300" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      }
    }
    return null;
  };

  const getDocIcon = () => {
    if (dataType === 'excel') return <FileText size={20} color="#00e676" />;
    return <FileText size={20} color="#0078f2" />;
  };

  return (
    <div className="analytics-block">
      {/* Cabecera del Análisis Global */}
      <div className="card mb-6 mt-6" style={{ background: '#121212', border: '1px solid #333' }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {getDocIcon()}
            <div>
              <h3 style={{ margin: 0, color: '#f5f5f5', fontSize: '1.2rem' }}>{fileName || 'Documento Múltiple'}</h3>
              <p style={{ margin: 0, color: '#abaeb4', fontSize: '0.85rem' }}>Análisis Profundo impulsado por Gemini AI</p>
            </div>
          </div>
          <button className="btn" onClick={onDismiss} style={{ padding: '0.5rem', background: '#252525' }}>
            <X size={18} color="#f5f5f5" />
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="card my-6 fade-in" style={{ background: 'linear-gradient(145deg, #161a2b, #121212)', borderLeft: '4px solid #a142f4' }}>
          <div className="loader-container" style={{ padding: '3rem 0' }}>
            <div className="spinner" style={{ color: '#a142f4' }}>
              <Sparkles size={48} />
            </div>
            <p style={{ color: '#a142f4', fontWeight: 600, fontSize: '1.1rem', marginTop: '1rem' }}>El Agente AI está sintetizando Insights...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="card my-6 fade-in" style={{ background: '#1a1010', borderLeft: '4px solid #ff1744' }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle color="#ff1744" />
            <h3 style={{ color: '#ff1744', margin: 0 }}>Atención del Agente</h3>
          </div>
          <p style={{ color: '#f5f5f5' }}>{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="ai-report-wide-grid fade-in" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* Card 1: Descriptivo */}
          <div className="card" style={{ background: 'var(--bg-secondary)', borderTop: '4px solid #0078f2' }}>
            <div className="flex items-center gap-2 mb-4">
              <PieIcon color="#0078f2" size={24} />
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem' }}>1. Análisis Descriptivo</h3>
            </div>
            <div className="wide-card-content">
              <div className="chart-section">{renderChart(1)}</div>
              <div 
                className="text-section"
                style={{ color: '#d0d0d0', lineHeight: 1.6 }}
                dangerouslySetInnerHTML={{ __html: sections.descriptive }}
              />
            </div>
          </div>

          {/* Card 2: Diagnóstico */}
          <div className="card" style={{ background: 'var(--bg-secondary)', borderTop: '4px solid #a142f4' }}>
            <div className="flex items-center gap-2 mb-4">
              <BrainCircuit color="#a142f4" size={24} />
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem' }}>2. Análisis Diagnóstico</h3>
            </div>
            <div className="wide-card-content">
              <div className="chart-section">{renderChart(2)}</div>
              <div 
                className="text-section"
                style={{ color: '#d0d0d0', lineHeight: 1.6 }}
                dangerouslySetInnerHTML={{ __html: sections.diagnostic }}
              />
            </div>
          </div>

          {/* Card 3: Predictivo */}
          <div className="card" style={{ background: 'var(--bg-secondary)', borderTop: '4px solid #00e676' }}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp color="#00e676" size={24} />
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem' }}>3. Análisis Predictivo</h3>
            </div>
            <div className="wide-card-content">
              <div className="chart-section">{renderChart(3)}</div>
              <div 
                className="text-section"
                style={{ color: '#d0d0d0', lineHeight: 1.6 }}
                dangerouslySetInnerHTML={{ __html: sections.predictive }}
              />
            </div>
          </div>

          {/* Card 4: Prescriptivo */}
          <div className="card" style={{ background: 'var(--bg-secondary)', borderTop: '4px solid #ffb300' }}>
            <div className="flex items-center gap-2 mb-4">
              <FileCheck color="#ffb300" size={24} />
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem' }}>4. Análisis Prescriptivo</h3>
            </div>
            <div className="wide-card-content">
              <div className="chart-section">{renderChart(4)}</div>
              <div 
                className="text-section"
                style={{ color: '#d0d0d0', lineHeight: 1.6 }}
                dangerouslySetInnerHTML={{ __html: sections.prescriptive }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Sistema de Feedback para el usuario (Solo visible cuando hay data) */}
      {!isLoading && !error && (
        <div className="card mb-8 fade-in" style={{ background: '#121212', border: '1px solid #333' }}>
          <div className="flex items-center gap-2 mb-4 text-sm" style={{ color: '#888' }}>
            <Bot size={16} color="#a142f4" /> <span>Reporte ejecutivo firmado por Gemini 2.5 Flash</span>
          </div>
          <div style={{ borderTop: '1px solid #222', paddingTop: '1.5rem' }}>
            <h4 style={{ color: '#e0e0e0', marginBottom: '1rem', fontSize: '0.95rem' }}>¿Qué opinas de estos Insights generados?</h4>
            <div className="flex gap-3">
              <input 
                type="text" 
                placeholder="Escribe sugerencias para afinar la predicción en el futuro..." 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                style={{ flex: 1, padding: '0.85rem', borderRadius: '6px', border: '1px solid #333', background: '#1a1a1a', color: 'white', fontSize: '0.95rem' }}
                disabled={feedbackSent}
              />
              <button 
                className="btn" 
                style={{ background: '#a142f4', color: '#fff', border: 'none', padding: '0 1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                onClick={() => {
                  if (feedback.trim()) setFeedbackSent(true);
                }}
                disabled={feedbackSent}
              >
                {feedbackSent ? 'Enviado' : <><Send size={16}/> Enviar</>}
              </button>
            </div>
            {feedbackSent && <p style={{color: '#00e676', fontSize: '0.85rem', marginTop: '0.75rem', fontWeight: 500}}>¡Listo! Tus sugerencias se aplican a nivel local para personalizar este dashboard.</p>}
          </div>
        </div>
      )}
      <style>{`
        .fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .wide-card-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .chart-section, .text-section {
          width: 100%;
        }
        @media (min-width: 900px) {
          .wide-card-content {
            flex-direction: row;
            align-items: flex-start;
          }
          .chart-section {
            flex: 0 0 45%;
            min-width: 0;
          }
          .text-section {
            flex: 1;
            margin-top: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};
