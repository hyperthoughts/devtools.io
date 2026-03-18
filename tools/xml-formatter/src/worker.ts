import xmlFormat from 'xml-formatter';

export type XMLFormatterOptions = {
  indentation: string;
  collapseContent: boolean;
  lineSeparator: string;
  whiteSpaceAtEndOfSelfclosingTag: boolean;
  stripComments: boolean;
};

const api = {
  formatXml: async (code: string, options: XMLFormatterOptions): Promise<string> => {
    try {
      if (!code.trim()) return '';
      return xmlFormat(code, options);
    } catch (e: any) {
      throw new Error(e.message || 'Failed to format XML');
    }
  },
  minifyXml: async (code: string): Promise<string> => {
    try {
      if (!code.trim()) return '';
      return xmlFormat(code, {
        indentation: '',
        collapseContent: true,
        lineSeparator: '',
      });
    } catch (e: any) {
      throw new Error(e.message || 'Failed to minify XML');
    }
  },
};

export type WorkerAPI = typeof api;
