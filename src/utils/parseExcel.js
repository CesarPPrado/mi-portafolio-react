import * as XLSX from 'xlsx';

export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Asumimos que el usuario quiere ver los datos de la primera hoja
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convertir la hoja a JSON
        // header: 1 permite que nos devuelva un array de arrays
        // pero usar el default (header no especificado) devuelve array de objetos, mucho más útil para recharts
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        
        // También podemos extraer todas las columnas para dar opciones de filtros
        let headers = [];
        if (jsonData.length > 0) {
          headers = Object.keys(jsonData[0]);
        }
        
        resolve({
          fileName: file.name,
          sheetName: firstSheetName,
          data: jsonData,
          headers: headers,
          rowCount: jsonData.length
        });
      } catch (error) {
        reject(new Error("Error procesando Excel: " + error.message));
      }
    };

    reader.onerror = (error) => {
      reject(new Error("Error al leer el archivo: " + error.message));
    };

    // Leer como ArrayBuffer que es mejor para XLSX
    reader.readAsArrayBuffer(file);
  });
};
