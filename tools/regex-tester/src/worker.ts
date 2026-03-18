export interface RegexMatch {
  match: string;
  index: number;
  groups: (string | undefined)[];
}

const api = {
  executeRegex: async (pattern: string, flags: string, text: string): Promise<RegexMatch[]> => {
    try {
      if (!pattern) return [];
      const regex = new RegExp(pattern, flags);
      const results: RegexMatch[] = [];
      let m;

      if (!regex.global) {
        m = regex.exec(text);
        if (m) {
          results.push({
            match: m[0],
            index: m.index,
            groups: m.slice(1),
          });
        }
        return results;
      }

      while ((m = regex.exec(text)) !== null) {
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        results.push({
          match: m[0],
          index: m.index,
          groups: m.slice(1),
        });
      }
      return results;
    } catch (err: any) {
      throw new Error(err.message);
    }
  },
};

export type WorkerAPI = typeof api;
