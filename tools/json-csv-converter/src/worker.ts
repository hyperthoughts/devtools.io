import Papa from 'papaparse';

const api = {
  jsonToCsv: async (jsonStr: string): Promise<string> => {
    if (!jsonStr.trim()) return '';
    try {
      const parsed = JSON.parse(jsonStr);
      let data = parsed;
      if (!Array.isArray(parsed)) {
        if (typeof parsed === 'object' && parsed !== null) {
          data = [parsed];
        } else {
          throw new Error('JSON is not an object or array of objects');
        }
      }
      return Papa.unparse(data);
    } catch (err: any) {
      throw new Error(`JSON to CSV failed: ${err.message}`);
    }
  },

  csvToJson: async (csvStr: string): Promise<string> => {
    if (!csvStr.trim()) return '';
    return new Promise((resolve, reject) => {
      Papa.parse(csvStr, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error(`CSV to JSON failed: ${results.errors[0].message}`));
          } else {
            resolve(JSON.stringify(results.data, null, 2));
          }
        },
        error: (error: any) => {
          reject(new Error(`CSV to JSON failed: ${error.message}`));
        },
      });
    });
  },
};

export type WorkerAPI = typeof api;
