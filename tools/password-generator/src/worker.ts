import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

zxcvbnOptions.setOptions({
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
});

const api = {
  evaluatePattern: async (password: string) => {
    const res = zxcvbn(password);
    return {
      score: res.score,
      guesses: res.guesses,
      crackTimeDisplay: res.crackTimesDisplay.offlineFastHashing1e10PerSecond,
      warning: res.feedback.warning,
      suggestions: res.feedback.suggestions,
    };
  },
};

export type WorkerAPI = typeof api;
