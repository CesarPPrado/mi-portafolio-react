import { GoogleGenerativeAI } from '@google/generative-ai';

// Utilizando la API Key de las variables de entorno de Vite
// En Render/Vercel esto se configura en el panel de Environment Variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateAnalysis = async (dataPayload, dataType) => {
  if (!API_KEY || API_KEY === 'AQUI_VA_TU_API_KEY_DE_GOOGLE_AI_STUDIO') {
    throw new Error('No se ha configurado la API Key de Gemini (VITE_GEMINI_API_KEY). Añádela en tu archivo .env.local o en Vercel/Render.');
  }

  const genAI = new GoogleGenerativeAI(API_KEY);

  // Reducimos el payload masivo si es muy grande para ahorrar recursos
  const limit = dataType === 'excel' ? 5000 : 15000;
  const dataString = JSON.stringify(dataPayload).substring(0, limit);

  const prompt = `
  Eres un experto Analista de Datos de nivel Senior en "Top Tech" o una empresa Top Tech. 
  Tu objetivo es analizar el siguiente conjunto de datos parcial extraído de un archivo ${dataType}.
  
  Pasos a seguir:
  A. Identifica de qué trata el archivo basándote en su contenido (ventas, servicio al cliente, educación, registros médicos, puras palabras, etc.).
  B. Genera un reporte usando ESTRICTAMENTE la siguiente estructura en markdown, y habla de forma clara y directiva (profesional). 
  NO añadas NINGÚN texto introductorio, saludos ni conclusiones finales. Tu respuesta DEBE comenzar con "#### **1. Análisis". 
  Mantén exactamente esta estructuración literal para facilitar su parsimonia en el código:

  #### **1. Análisis Descriptivo (¿Qué ha pasado?)**
  [Escribe aquí el resumen de los patrones históricos o los datos extraídos principales]
  
  #### **2. Análisis Diagnóstico (¿Por qué ha pasado?)**
  [Escribe aquí las posibles causas de los eventos, problemas o tendencias observadas]
  
  #### **3. Análisis Predictivo (¿Qué va a pasar?)**
  [Escribe aquí un pronóstico o proyección futura basada en algoritmos estadísticos inferidos o sentido común sobre esta muestra]
  
  #### **4. Análisis Prescriptivo (¿Qué debemos hacer?)**
  [Escribe aquí recomendaciones de acciones concretas a tomar para maximizar resultados o mitigar riesgos]

  ---
  **Generado por el Agente Analítico:** Model Gemini 2.5 Flash
  **Framework:** Analytics Core Dashboard

  ---
  Muestra de datos de contexto:
  ${dataString}
  
  (Nota: El texto está truncado intencionalmente para no saturar la memoria).
  `;

  // Fallback de modelos en caso de alta demanda (Error 503)
  const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const textResult = await result.response.text();
      return textResult; // Si funciona, retornamos y salimos del bucle
    } catch (err) {
      lastError = err;
      // Si el error es de sobrecarga o cuota (503 / 429), intentamos con el siguiente modelo de la lista
      if (err.message.includes('503') || err.message.includes('429')) {
        console.warn(`[Gemini] El modelo ${modelName} está saturado o sin cuota, intentando con alternativa...`);
        continue;
      }
      // Para otros errores graves (ej. API Key inválida), detenemos inmediatamente
      if (err.message.includes('API key not valid')) {
        throw new Error("La API Key provista de Gemini es inválida. Revisa tu panel en Google AI Studio.");
      }
      throw new Error("Fallo al comunicarse con Gemini AI: " + err.message);
    }
  }

  // Si todos los modelos fallaron por demanda, mostramos un mensaje amigable
  if (lastError && (lastError.message.includes('503') || lastError.message.includes('429'))) {
    throw new Error("Los servidores de Google AI están experimentando una demanda extremadamente alta en todos sus modelos gratuitos. Por favor, intenta de nuevo en unos minutos.");
  }
  
  throw new Error("Fallo al comunicarse con Gemini AI: " + lastError.message);
};
