import mammoth from 'mammoth';

export const parseWordFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;
        
        // Extraer texto puro
        const result = await mammoth.extractRawText({ arrayBuffer });
        const text = result.value;
        const messages = result.messages; // warnings, etc
        
        // Analizando el documento
        const words = text.match(/\b\w+\b/g) || [];
        const charCount = text.length;
        const wordCount = words.length;
        
        // Contar frecuencia de palabras (excluyendo palabras muy cortas)
        const wordFrequency = {};
        words.forEach(w => {
          const lower = w.toLowerCase();
          if (lower.length > 3) { // Ignorar conectores cortos
            wordFrequency[lower] = (wordFrequency[lower] || 0) + 1;
          }
        });
        
        // Ordenar las palabras más frecuentes y tomar un top 10
        const sortedFrequency = Object.entries(wordFrequency)
          .map(([word, count]) => ({ word, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);
        
        resolve({
          fileName: file.name,
          text: text,
          wordCount,
          charCount,
          topWords: sortedFrequency,
          preview: text.substring(0, 300) + '...'
        });
      } catch (error) {
        reject(new Error("Error procesando Word: " + error.message));
      }
    };

    reader.onerror = (error) => {
      reject(new Error("Error leyendo el archivo Word: " + error.message));
    };

    reader.readAsArrayBuffer(file);
  });
};
