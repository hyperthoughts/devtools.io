// Optional web worker entry point.
// Delete this file if your tool doesn't need workers.
// Set capabilities.needsWorker = true and capabilities.workerEntry to use.

const api = {
  async process(data: string): Promise<string> {
    return data;
  },
};

export type WorkerAPI = typeof api;
